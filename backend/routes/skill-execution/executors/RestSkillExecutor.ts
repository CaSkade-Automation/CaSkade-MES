import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import axios, { AxiosRequestConfig } from 'axios';
import { SkillVariable, SkillVariableDto } from '@shared/models/skill/SkillVariable';
import { GraphDbConnectionService } from 'util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { opcUaSkillExecutionMapping } from './skill-execution-mappings';

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

    invokeTransition(executionRequest: SkillExecutionRequestDto): void {
        // set parameters

        // // get the full REST service description
        const serviceDescription = this.getRestServiceDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        // const queryParams = [];
        // serviceDescription.parameters.filter(parameter => {
        //     if((parameter.location == "other") && (parameter.type == "QueryParameter")) {
        //         queryParams.push(parameter);
        //     }
        // });


        // // Create a simple json object for all body parameters
        // const requestBody = {};
        // serviceDescription.parameters.filter(parameter => {
        //     if(parameter.location == "body") {
        //         requestBody[parameter.name] = parameter.value;
        //     }
        // });

        // // Execute the service request
        // const config: AxiosRequestConfig = {
        //     headers: {'content-type' : 'application/json'},
        //     url:
        // }

        // axios({
        //     headers: {'content-type' : 'application/json'},
        //     method: serviceDescription.methodType,
        //     url: serviceDescription.fullPath + createQueryParameterString(queryParams),
        //     data: JSON.stringify(requestBody)
        // })
        //     .then((serviceResponse) => {
        //         res.status(200).json({
        //             "msg": "Service execution added and executed",
        //             "res": serviceResponse.data
        //         });
        //     })
        //     .catch((serviceErr) => {
        //         res.status(500).json({
        //             "msg": "Internal Error while executing the service",
        //             "err": serviceErr
        //         });
        //     });
    }


    private async getRestServiceDescription(skillIri: string, commandIri: string): Promise<RestSkillDescription> {
        const query = `
        SELECT ?path ?basePath ?httpMethod ?parameters WHERE {
            <${skillIri}> a Cap:RestSkill;
                WADL:hasBase ?basePath;
                WADL:hasResource ?resource.
            ?resource WADL:hasPath ?path;
                WADHL:hasMethod ?skillMethod.
            ?skillMethod rdf:type ?httpMethod.
            ?httpMethod sesame:directSubClassOf WADL:Method.
            <${commandIri}> a ISA88:Transition;
                Cap:invokedBy ?skillMethod.
            OPTIONAL {
                ?skillMethod WADL:hasRequest/WADL:hasParameter ?param.
                ?param WADL:hasParameterName ?paramName;
                    WADL:hasParameterType ?paramType;
                    WADL:hasParameterDefault ?default;
                    WADL:hasParameterRequired ?required;
                ?
            }
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        // const mappedResult = this.converter.convertToDefinition(queryResult.results.bindings, opcUaSkillExecutionMapping);
        return null;
    }

}

interface RestSkillDescription {
   httpMethod: string;
   fullPath: string;
   parameters: SkillVariable[];
}
