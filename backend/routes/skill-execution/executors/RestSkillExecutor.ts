import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { SkillVariable, SkillVariableDto, ParameterQueryResult, OutputQueryResult } from '@shared/models/skill/SkillVariable';
import { GraphDbConnectionService } from 'util/GraphDbConnection.service';
import { SparqlResultConverter } from 'sparql-result-converter';
import { restSkillMapping } from './skill-execution-mappings';
import { query } from 'express';
import { getRestSkillMethodQuery, getRestStatefulMethodQuerySnippet, getRestStatelessMethodQuerySnippet } from './RestSkillQueries';

export class RestSkillExecutionService extends SkillExecutor {


    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private converter = new SparqlResultConverter()) {
        super();
    }

    setSkillParameters(skillIri: string, parameters: SkillVariableDto[]): void {
        throw new Error("Method not implemented.");
    }

    async getSkillOutputs(executionRequest: SkillExecutionRequestDto): Promise<void> {
        const skillDescription = await this.getStatelessRestMethodDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        const requestConfig: AxiosRequestConfig = {
            headers: {'content-type' : 'application/json'},
            url: skillDescription.fullPath,
            method: <Method>skillDescription.httpMethod,
        };

        try {
            const response = await axios(requestConfig);
            console.log(response.data);

            return response.data;
        } catch (error) {
            throw new Error(`Error while executing skill '${executionRequest.skillIri}'. Error ${error}`);
        }
    }

    async invokeTransition(executionRequest: SkillExecutionRequestDto): Promise<void> {
        // set parameters

        // // get the full REST service description
        const skillDescription = await this.getRestServiceDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        // const queryParams = [];
        // serviceDescription.parameters.filter(parameter => {
        //     if((parameter.location == "other") && (parameter.type == "QueryParameter")) {
        //         queryParams.push(parameter);
        //     }
        // });


        // Create a simple json object for all body parameters
        const matchedParameters = this.findMatchingParameters(executionRequest.parameters, skillDescription.parameters);



        //     // Execute the service request
        const requestConfig: AxiosRequestConfig = {
            headers: {'content-type' : 'application/json'},
            url: skillDescription.fullPath,
            method: <Method>skillDescription.httpMethod,
            data: matchedParameters
        };

        try {
            const response = await axios(requestConfig);
            return response.data;
        } catch (error) {
            throw new Error(`Error while executing skill '${executionRequest.skillIri}'. Error ${error}`);
        }

    }


    private async getRestServiceDescription(skillIri: string, commandTypeIri: string): Promise<RestSkillMethodDescription> {
        const query = getRestSkillMethodQuery(skillIri) + getRestStatefulMethodQuerySnippet(commandTypeIri) + '}';
        const queryResult = await this.graphDbConnection.executeQuery(query);

        const mappedResult = this.converter.convertToDefinition(queryResult.results.bindings, restSkillMapping).getFirstRootElement()[0] as RestSkillQueryResult;
        const restSkillMethodDescription = new RestSkillMethodDescription(skillIri, commandTypeIri, mappedResult);

        return restSkillMethodDescription;
    }

    private async getStatelessRestMethodDescription(skillIri: string, commandTypeIri: string): Promise<RestSkillMethodDescription> {
        const query = getRestSkillMethodQuery(skillIri) + getRestStatelessMethodQuerySnippet(commandTypeIri) + '}';
        const queryResult = await this.graphDbConnection.executeQuery(query);

        const mappedResult = this.converter.convertToDefinition(queryResult.results.bindings, restSkillMapping).getFirstRootElement()[0] as RestSkillQueryResult;
        const restSkillMethodDescription = new RestSkillMethodDescription(skillIri, commandTypeIri, mappedResult);

        return restSkillMethodDescription;
    }



    private findMatchingParameters(executionParameters: SkillVariable[], describedParameters: SkillVariable[]): Record<string, string>{
        const matchedParameters = {};

        // check if all execution parameters are contained in the ontology description
        describedParameters.forEach(descParam => {
            const foundParam = executionParameters.find(execParam => descParam.name == execParam.name);
            if(descParam.required && !foundParam ){
                throw new Error(`The parameter '${descParam.name}' is required but was not found in the execution`);
            }
            else {
                matchedParameters[foundParam.name] = foundParam.value;
            }
        });

        // Check that all sent parameters exist in the ontology
        executionParameters.forEach(execParam => {
            if(!describedParameters.find(descParam => descParam.name == execParam.name)) {
                throw new Error(`The entered parameter '${execParam.name}' was not found in the ontology`);
            }
        });

        return matchedParameters;
    }

}

interface RestSkillQueryResult {
    basePath: string,
    path: string,
    httpMethod: string,
    parameters: ParameterQueryResult []
    outputs: OutputQueryResult []
}



class RestSkillMethodDescription {
    httpMethod: string;
    fullPath: string;
    parameters: SkillVariable[];

    constructor(public skillIri: string, public commandTypeIri: string, queryResult: RestSkillQueryResult) {
        this.fullPath = this.createPath(queryResult.basePath, queryResult.path);
        this.parameters = queryResult.parameters.map(queryResultParam => SkillVariable.fromParameterQueryResult(queryResultParam));
        this.httpMethod = queryResult.httpMethod;
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
