import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { GraphDbConnectionService } from '../../../../util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { NodeId, makeBrowsePath, AttributeIds} from 'node-opcua';
import { InternalServerErrorException } from '@nestjs/common';
import { SkillService } from '../../../../routes/skills/skill.service';
import { OpcUaSkillExecutor, OpcUaSkillParameter } from './OpcUaSkillExecutor';
import { opcUaMethodSkillMapping } from '../skill-execution-mappings';


export class OpcUaMethodSkillExecutionService extends OpcUaSkillExecutor{

    constructor(graphDbConnection: GraphDbConnectionService, skillService: SkillService, skillIri: string) {
        super(graphDbConnection, skillIri);
        this.graphDbConnection = graphDbConnection;
        this.skillService = skillService;
        this.converter = new SparqlResultConverter();
    }

    /**
     * Write all skill variables
     * @param skillIri IRI of the skill
     * @param parameters Parameters and the values that are written
     */
    async setSkillParameters(executionRequest: SkillExecutionRequestDto): Promise<void> {
        const parameterDescription = await this.getOpcUaParameterDescription(executionRequest.skillIri);
        const requestParameters = executionRequest.parameters;

        try {
            // Write all parameters
            for (const describedParameter of parameterDescription.parameters) {
                const foundReqParam = requestParameters.find(reqParam => reqParam.name == describedParameter.parameterName);
                if(foundReqParam && foundReqParam.value) {
                    await this.writeSingleNode(describedParameter.parameterNodeId, foundReqParam.value);
                }
            }
        } catch (err) {
            console.log(`Error while writing value: ${err}`);
        } finally {
            this.endUaConnection();
        }

    }


    /**
     * Returns outputs of a skill
     * @param executionRequest
     */
    async getSkillOutputs(executionRequest: SkillExecutionRequestDto): Promise<unknown> {
        const skill = await this.skillService.getSkillByIri(executionRequest.skillIri);
        const outputDtos = skill.skillOutputsDtos;

        if (outputDtos == undefined || outputDtos.length == 0 ) return null;

        const skillMethodDescription = await this.getStatelessOpcUaMethodDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        try {
            // Call the method and get the output values. Note that these are just values without names (fail of OPC UA)
            const methodResult = await this.callMethod(skillMethodDescription.methodNodeId);
            const methodOutput = methodResult.outputArguments;

            // Read the nodes of the output arguments to get an array including names (but without values)
            const methodNode = NodeId.resolveNodeId(skillMethodDescription.methodNodeId);
            const [output] = await this.uaSession.translateBrowsePath([
                makeBrowsePath(methodNode,".OutputArguments"),
            ]);
            const outputArgumentNodeId  =  output.targets[0].targetId;
            const nodesToRead = [
                { attributeIds: AttributeIds.Value, nodeId: outputArgumentNodeId },
            ];

            const [outputArgumentValue]  = await this.uaSession.read(nodesToRead);

            // Match named output arguments with values of the call
            for (let i = 0; i < methodOutput.length; i++) {
                methodOutput[i]["name"] = outputArgumentValue.value.value[i].name;
            }

            outputDtos.forEach(output => {
                const matchingResult = methodOutput.find(res => res["name"] == output.name);
                output.value = matchingResult.value;
            });
            console.log(outputDtos);

            return outputDtos;
        } catch (err) {
            throw new InternalServerErrorException();
        } finally {
            this.endUaConnection();
        }
    }


    /**
     * Invoke a transition by calling an OPC UA method. Note that all parameters are set before calling the method.
     * @param executionRequest
     */
    async invokeTransition(executionRequest: SkillExecutionRequestDto): Promise<any> {
        const skillDescription = await this.getOpcUaMethodSkillDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        try {
            // Write all parameters
            for (const param of skillDescription.parameters) {
                const foundReqParam = executionRequest.parameters.find(reqParam => reqParam.name == param.parameterName);
                if(foundReqParam && foundReqParam.value) {
                    await this.writeSingleNode(param.parameterNodeId, foundReqParam.value);
                }

            }

            // Call the method
            await this.callMethod(skillDescription.methodNodeId);

        } catch (err) {
            console.log(`Error while invoking transition ${executionRequest.commandTypeIri} on skill ${executionRequest.skillIri}`);
            console.log(err);
            throw new InternalServerErrorException();
        } finally {
            this.endUaConnection();
        }


        return skillDescription;
    }


    async getOpcUaMethodSkillDescription(skillIri: string, commandTypeIri: string): Promise<OpcUaSkillMethod> {
        const query = `
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
        PREFIX CaSkMan: <http://www.w3id.org/hsu-aut/caskman#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
        SELECT ?skillIri ?skillInterface ?skillMethodIri ?skillNodeId ?methodNodeId ?endpointUrl ?messageSecurityMode ?securityPolicy
        ?userName ?password ?parameterIri ?parameterRequired ?parameterName ?parameterType ?parameterUaType ?parameterNodeId WHERE {
            BIND(<${skillIri}> AS ?skillIri).
            ?skillIri a CSS:Skill;
                CSS:accessibleThrough ?skillInterface.
            ?skillInterface OpcUa:nodeId ?skillNodeId.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?skillInterface;
                OpcUa:hasEndpointUrl ?endpointUrl;
                OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                OpcUa:hasSecurityPolicy ?securityPolicy.
            OPTIONAL {
                ?uaServer OpcUa:requiresUserName ?userName;
                OpcUa:requiresPassword ?password
            }
            <${commandTypeIri}> rdfs:subClassOf ISA88:Transition.
            ?command a <${commandTypeIri}>;
                CaSk:isInvokedBy ?skillMethodIri.
            ?skillMethodIri a OpcUa:UAMethod;
                OpcUa:componentOf ?skillInterface;
                OpcUa:nodeId ?methodNodeId.
            OPTIONAL {
                ?skillIri CSS:hasParameter ?parameterIri.
                ?parameterIri a CSS:SkillParameter;
                    CaSk:hasVariableName ?parameterName;
                    CaSk:hasVariableType ?parameterType;
                    CaSk:isRequired ?parameterRequired;
                    OpcUa:nodeId ?parameterNodeId;
                    OpcUa:hasDataType ?parameterUaType.
            }
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        console.log(queryResult.results.bindings);

        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaMethodSkillMapping)
            .getFirstRootElement()[0] as OpcUaSkillQueryResult;

        const opcUaSkillDescription = new OpcUaSkillMethod(skillIri, commandTypeIri, mappedResult);
        return opcUaSkillDescription;
    }




    async getStatelessOpcUaMethodDescription(skillIri: string, commandTypeIri: string): Promise<OpcUaSkillMethod> {
        const query = `
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
        PREFIX CaSkMan: <http://www.w3id.org/hsu-aut/caskman#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
        SELECT ?skillIri ?skillInterface ?skillMethodIri ?skillNodeId ?methodNodeId ?endpointUrl ?messageSecurityMode ?securityPolicy
        ?userName ?password ?parameterIri ?parameterRequired ?parameterName ?parameterType ?parameterUaType ?parameterNodeId WHERE {
            BIND(<${skillIri}> AS ?skillIri).
            ?skillIri a CSS:Skill;
                CSS:accessibleThrough ?skillInterface.
            ?skillInterface a CaSkMan:OpcUaMethodSkillInterface;
                        OpcUa:nodeId ?skillNodeId.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?skillInterface;
                OpcUa:hasEndpointUrl ?endpointUrl;
                OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                OpcUa:hasSecurityPolicy ?securityPolicy.
            OPTIONAL {
                ?uaServer OpcUa:requiresUserName ?userName;
                OpcUa:requiresPassword ?password
            }
            <${commandTypeIri}> rdfs:subClassOf CaSk:SkillMethod.
            ?skillMethodIri a <${commandTypeIri}>;
                a OpcUa:UAMethod;
                OpcUa:componentOf ?skillInterface;
                OpcUa:nodeId ?methodNodeId.
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaMethodSkillMapping)
            .getFirstRootElement()[0] as OpcUaSkillQueryResult;

        const opcUaSkillDescription = new OpcUaSkillMethod(skillIri, commandTypeIri, mappedResult);
        return opcUaSkillDescription;
    }

}


// TODO: Align with SkillParameter, fix this mess
class OpcUaSkillQueryResult {
    skillNodeId: string;
    skillInterface: string;
    skillMethod: string;
    methodNodeId: string;
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    username: string;
    password: string;
    parameters: OpcUaSkillParameter[];
}



/**
 * Class a skill including a method to invoke a certain commandType
 */
class OpcUaSkillMethod {
    private skillQueryResult: OpcUaSkillQueryResult;

    /**
     * Creates a new OpcUaSkillMethod
     * @param skillIri IRI of the skill
     * @param commandTypeIri IRI of the command type (= the transition) to invoke
     * @param skillQueryResult Result of a skill query
     */
    constructor(public skillIri: string, public commandTypeIri: string, skillQueryResult: OpcUaSkillQueryResult) {
        this.skillQueryResult = skillQueryResult;
    }

    get skillNodeId(): string { return this.skillQueryResult.skillNodeId;}
    get endpointUrl(): string { return this.skillQueryResult.endpointUrl;}
    get methodNodeId(): string { return this.skillQueryResult.methodNodeId;}
    get messageSecurityMode(): string { return this.skillQueryResult.messageSecurityMode;}
    get securityPolicy():string { return this.skillQueryResult.securityPolicy;}
    get username(): string { return this.skillQueryResult.username;}
    get password(): string { return this.skillQueryResult.password;}
    get parameters(): any[] { return this.skillQueryResult.parameters;}
}



