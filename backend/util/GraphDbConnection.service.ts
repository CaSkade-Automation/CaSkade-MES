import { Injectable } from "@nestjs/common";
import Axios from "axios";

@Injectable()
export class GraphDbConnectionService {

    config: GraphDbConfig;

    constructor() {
        const host = "http://localhost:7200";
        const user = "ops";
        const password = "ops";
        const selectedRepo = "Test_OPS-DB";
        this.config = new GraphDbConfig(host, user, password, selectedRepo);
    }

    /**
     * Completely exchanges the host configuration against a new one
     * @param {*} newConfig The new host config (consisting of host, user, pw)
     */
    async changeConfig(newConfig: GraphDbConfig): Promise<GraphDbConfig> {
        const oldConfig = this.config;

        this.setConfig(newConfig);

        // Make sure this configuration is valid
        const repos = await this.getRepositories();
        if (repos) {
            return newConfig;
        }
        else {
            this.setConfig(oldConfig);
            return oldConfig;
        }
    }


    getConfig(): GraphDbConfig {
        return this.config;
    }

    setConfig(newConfig: GraphDbConfig) {
        this.config = newConfig;
    }

    getSelectedRepo() {
        return this.config.selectedRepo;
    }

    async addRdfDocument(rdfDocument: string, context: string) {
        const contentType = "application/x-turtle; charset=UTF-8";      // TODO: Get the real contentType, could also be RDF/XML
        context = `?context=%3Curn:${context}%3E`;
        return this.executeStatement(rdfDocument, context, contentType);
    }


    /**
     * Deletes all content from a given graph
     * @param {*} graphName Name of the graph to be deleted
     */
    async clearGraph(graphName: string) {
        const contentType = "application/x-www-form-urlencoded";
        const statement = `update=CLEAR GRAPH <${graphName}>`;
        return this.executeStatement(statement, "", contentType);
    }


    /**
     * Executes a statement against the current repository of the graph database
     * @param {*} statement Statement to execute
     * @param {*} context Context (=graph) that the statement is executed in
     * @param {*} contentType Content type of the statement (either application/rdf+xml for update strings or application/x-www-form-urlencoded for an rdf document)
     */
    async executeStatement(statement: string, context: string, contentType: string) {
        const url = this.getStatementEndpointString(context);

        const headers = {
            'Authorization': this.createBase64AuthString(),
            'Accept': 'application/json',
            'Content-Type': contentType
        };

        try {
            const dbResponse = await Axios.post(url, statement,{ 'headers': headers });

            return {"statusCode": dbResponse.request.res.statusCode,
                "msg": dbResponse.data};

        } catch (err) {
            if (err.response.status == 400) {       // On error: If its just a query mistake (graphdb 400) -> return this query mistake
                throw new Error(`Mistake in your statement: ${err.response.data}`);
            } else {                                // On error: If something really went wrong: Throw error
                throw new Error(`Error while executing statement: ${err}`);
            }
        }
    }


    /**
     * Execute a query against the currently selected repository
     * @param {*} queryString The query to execute
     */
    private async executeSparqlRequest(queryString:string, contentType: string): Promise<GraphDbResult> {
        const headers = {
            "Authorization": this.createBase64AuthString(),
            "Accept": "application/sparql-results+json",
            "Content-Type": contentType
        };

        try {
            const dbResponse = await Axios.post(
                this.getCurrentRepoEndpointString(),
                queryString,
                { 'headers': headers }
            );
            return dbResponse.data;                 // Everything ok -> return the response body (data)
        } catch (err) {
            console.log(err);

            if (err.response.status == 400) {       // On error: If its just a query mistake (graphdb 400) -> return this query mistake
                throw new Error(`Mistake in your query: ${err.response.data}`);
            } else {                                // On error: If something really went wrong: Throw error
                throw new Error(`Error while executing query: ${err}`);
            }
        }
    }

    executeQuery(sparqlQuery: string) : Promise<GraphDbResult> {
        return this.executeSparqlRequest(sparqlQuery, "application/sparql-query");
    }

    executeUpdate(sparqlUpdate: string) {
        return this.executeStatement(sparqlUpdate,"","application/sparql-update");
    }





    /**
     * Create a string pointing to all repositories at the current graphdb
     */
    getRepositoriesEndpoint() {
        const repositoriesEndpoint = this.config.host + "/repositories";
        return repositoriesEndpoint;
    }


    /**
     * Get all repositories of the currently selected graphdb
     */
    async getRepositories() {
        console.log("trying to get to: " + this.getRepositoriesEndpoint());
        console.log(this.createBase64AuthString());
        try {
            const response = Axios.get(this.getRepositoriesEndpoint(), {
                headers: {
                    "Authorization": this.createBase64AuthString(),
                    "Accept": "application/json"
                }
            });
            return response;
        } catch (error) {
            return error;
        }
    }


    /**
     * Get the currently selected repository endpoint
     */
    getCurrentRepoEndpointString() {
        const repoEndpoint = this.getRepositoriesEndpoint() + "/" + this.config.selectedRepo;
        return repoEndpoint;
    }


    /**
     * Returns the current statement endpoint string with a given context
     * @param {*} context The context (aka named graph) that a statement is to be added to
     */
    getStatementEndpointString(context = "") {
        let endpointString = `${this.getCurrentRepoEndpointString()}/statements`;
        if (context !== "") {
            endpointString += `${context}`;
        }
        return endpointString;
    }


    /**
     * Create Base64-encrypted auth string for graphDb authentication
     */
    createBase64AuthString() {
        const authString = Buffer.from(this.config.user + ":" + this.config.password);
        const authStringBase64 = "Basic " + authString.toString('base64');
        return authStringBase64;
    }
}



export class GraphDbConfig {
    constructor(
        public host: string,
        public user: string,
        public password: string,
        public selectedRepo: string) { }
}


export interface GraphDbResult {
    head: {
        vars: Array<string>;
    };
    results: {
        bindings: Array<
            {
                [key: string]: {
                    type: string;
                    value: any;
                };
            }
        >;
    };
}
