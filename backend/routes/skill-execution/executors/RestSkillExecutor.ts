import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { SkillVariable, SkillVariableDto } from '@shared/models/skill/SkillVariable';
import { GraphDbConnectionService } from 'util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { restSkillMapping } from './skill-execution-mappings';
import { Dictionary } from 'lodash';

export class RestSkillExecutionService extends SkillExecutor {


    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private converter = new SparqlResultConverter()) {
        super();
    }

    setSkillParameters(skillIri: string, parameters: SkillVariableDto[]): void {
        throw new Error("Method not implemented.");
    }

    getSkillOutputs(executionRequest: SkillExecutionRequestDto): void {
        throw new Error("Method not implemented.");
    }

    async invokeTransition(executionRequest: SkillExecutionRequestDto): Promise<void> {
        // set parameters

        // // get the full REST service description
        const restSkillDescription = await this.getRestServiceDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        // const queryParams = [];
        // serviceDescription.parameters.filter(parameter => {
        //     if((parameter.location == "other") && (parameter.type == "QueryParameter")) {
        //         queryParams.push(parameter);
        //     }
        // });


        // Create a simple json object for all body parameters
        const matchedParameters = this.findMatchingParameters(executionRequest.parameters, restSkillDescription.parameters);



        const fullPath = basePath + path;

        //     // Execute the service request
        const requestConfig: AxiosRequestConfig = {
            headers: {'content-type' : 'application/json'},
            url: fullPath,
            method: <Method>restSkillDescription.httpMethod,
            data: matchedParameters
        };

        try {
            const response = await axios(requestConfig);
            return response.data;
        } catch (error) {
            throw new Error(`Error while executing skill '${executionRequest.skillIri}'. Error ${error}`);
        }

    }


    private async getRestServiceDescription(skillIri: string, commandTypeIri: string): Promise<RestSkillDescription> {
        const query = `
        PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
        PREFIX WADL: <http://www.hsu-ifa.de/ontologies/WADL#>
        PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
        PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?basePath ?path  ?httpMethod ?parameterIri ?parameterName ?parameterType ?parameterRequired WHERE {
            <${skillIri}> a Cap:RestSkill;
                WADL:hasBase ?basePath;
                WADL:hasResource ?resource.
            ?resource WADL:hasPath ?path;
                WADL:hasMethod ?skillMethod.
            ?skillMethod a ?wadlMethod.
            ?wadlMethod sesame:directSubClassOf WADL:Method.
            BIND(strafter(str(?wadlMethod), "#") AS ?httpMethod).
            ?wadlMethod sesame:directSubClassOf WADL:Method.
            <${commandTypeIri}> rdfs:subClassOf ISA88:Transition.
            ?command a <${commandTypeIri}>;
            Cap:invokedBy ?skillMethod.
            OPTIONAL {
                ?skill Cap:hasSkillParameter ?parameterIri.
                ?skillMethod WADL:hasRequest/WADL:hasRepresentation/WADL:hasParameter ?parameterIri.    # Make sure the skill's parameters are availabe over the method
                ?parameterIri a Cap:SkillParameter;
                    Cap:hasVariableName ?parameterName;
                    Cap:hasVariableType ?parameterType;
                    Cap:isRequired ?parameterRequired;
            }
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);

        const mappedResult = this.converter.convertToDefinition(queryResult.results.bindings, restSkillMapping).getFirstRootElement()[0] as RestSkillQueryResult;
        return mappedResult;
    }

    private findMatchingParameters(executionParameters: SkillVariable[], describedParameters: SkillVariable[]): Record<string, string>{
        const matchedParameters = {};

        // check if all execution parameters are contained in the ontology description
        executionParameters.forEach(execParam => {
            const foundParam = describedParameters.find(descParam => descParam.name == execParam.name);
            if(!foundParam ){
                throw new Error(`The entered parameter '${execParam.name}' was not found`);
            }
            else {
                matchedParameters[foundParam.name] = foundParam.value;
            }
        });

        // Check that all required parameters of the ontology are set
        const requiredParams = describedParameters.filter(descParam => descParam.required);
        requiredParams.forEach(reqParam => {
            const matchedReqParam = matchedParameters[reqParam.name];
            if(!matchedReqParam || matchedReqParam.value == undefined) {
                throw new Error(`The parameter '${reqParam.name}' is required but was not found in the execution`);
            }
        });

        return matchedParameters;
    }

}

interface RestSkillQueryResult {
    basePath: string,
    path: string,
    httpMethod: string,
    parameters: {
        parameterIri: string,
        parameterName: string,
        parameterType: string,
        parameterRequired: boolean
    } []
}

class RestSkillMethodDescription {
    httpMethod: string;
    fullPath: string;
    parameters: SkillVariable[];

    constructor(public skillIri: string, public commandTypeIri: string, queryResult: RestSkillQueryResult) {
        this.fullPath = this.createPath(queryResult.basePath, queryResult.path);
        queryResult.parameters.forEach(queryResultParam => {
            new SkillVariable(queryResultParam);
        });
    }

    private createPath(basePath: string, path: string): string {
        basePath = basePath.trimRight();
        path = path.trimLeft();
        if (!basePath.endsWith("/")) {
            basePath += "/";
        }
        if (path.startsWith("/")) {
            path = path.substr(1);
        }
        return basePath + path;
    }


}
