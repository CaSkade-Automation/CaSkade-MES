import { SkillExecutor } from './SkillExecutor';
import { SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { SkillVariable, SkillVariableDto, ParameterQueryResult, OutputQueryResult } from '@shared/models/skill/SkillVariable';
import { GraphDbConnectionService } from "../../../util/GraphDbConnection.service";
import { SparqlResultConverter } from 'sparql-result-converter';
import { restSkillMapping } from './skill-execution-mappings';
import { getRestSkillMethodQuery, getRestStatefulMethodQuerySnippet, getRestStatelessMethodQuerySnippet } from './RestSkillQueries';

export class RestSkillExecutionService extends SkillExecutor {


    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private converter = new SparqlResultConverter()) {
        super();
    }

    async setSkillParameters(executionRequest: SkillExecutionRequestDto): Promise<void> {
        const skillDescription = await this.getStatelessRestMethodDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        // Match the described parameters (from ontology) with the ones given in the request
        const matchedParameters = this.findMatchingParameters(executionRequest.parameters, skillDescription.parameters);

        this.sendRequest(skillDescription, matchedParameters);
    }

    /**
     *
     */
    async getSkillOutputs(executionRequest: SkillExecutionRequestDto): Promise<SkillVariableDto[]> {
        const skillDescription = await this.getStatelessRestMethodDescription(executionRequest.skillIri, executionRequest.commandTypeIri);
        const outputs = this.sendRequest<SkillVariable[]>(skillDescription);
        return outputs;
    }

    async invokeTransition(executionRequest: SkillExecutionRequestDto): Promise<void> {
        // Get the full REST service description
        const skillDescription = await this.getRestServiceDescription(executionRequest.skillIri, executionRequest.commandTypeIri);

        // Match the described parameters (from ontology) with the ones given in the request
        const matchedParameters = this.findMatchingParameters(executionRequest.parameters, skillDescription.parameters);

        return this.sendRequest(skillDescription, matchedParameters);

    }


    /**
     * Sends the actual request to invoke a RestSkill
     * @param skillDescription Description of the RestSkill with all relevant attributes
     * @param parameters Matched parameters with their values
     * @returns
     */
    private async sendRequest<T>(skillDescription: RestSkillMethodDescription, parameters: SkillVariable[] = []): Promise<T> {

        // Build the request and send it afterwards
        const requestConfig: AxiosRequestConfig = {
            headers: {'content-type' : 'application/json'},
            url: skillDescription.fullPath,
            method: <Method>skillDescription.httpMethod,
            data: parameters
        };

        try {
            const response = await axios(requestConfig);
            return response.data as T;
        } catch (error) {
            throw new Error(`Error while executing skill '${skillDescription.skillIri}'. Error ${error}`);
        }

    }


    private async getRestServiceDescription(skillIri: string, commandTypeIri: string): Promise<RestSkillMethodDescription> {
        // Assemble the query and execute it
        const query = getRestSkillMethodQuery(skillIri) + getRestStatefulMethodQuerySnippet(commandTypeIri) + '}';
        const queryResult = await this.graphDbConnection.executeQuery(query);

        // Get the result, map it and get a valid RestSkillMethodDescription
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
        this.parameters = queryResult.parameters.map(queryResultParam => SkillVariable.fromVariableQueryResult(queryResultParam));
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
