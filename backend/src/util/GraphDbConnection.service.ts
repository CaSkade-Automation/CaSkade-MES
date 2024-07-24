import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Axios from "axios";

@Injectable()
export class GraphDbConnectionService {

    config: GraphDbConfig;

    constructor(
        private configService: ConfigService,
    ) {
        const host = this.configService.get("graphDbUrl");
        const user = "skillmex";
        const password = "skillmex";
        const selectedRepo = "test-repo";
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

    updateConfig(key: string, value: string) {
        this.config[key] = value;
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

    async addRdfDocument(rdfDocument: string, context: string, contentType = "application/x-turtle; charset=UTF-8") {
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

    async exportStatementsInGraph(graphIri: string, format = "text/turtle"): Promise<string> {
        const url = this.getCurrentRepoEndpointString() + `/rdf-graphs/service?graph=${graphIri}`;
        const headers = {
            "Authorization": this.createBase64AuthString(),
            "Accept": format,
        };
        try {
            const dbResponse = await Axios.get<string>(url, { 'headers': headers });

            return dbResponse.data;

        } catch (err) {
            throw new Error(`GraphDB Error. This typically means that something is wrong with your RDF data or query.
                GraphDB error message: ${err.response.data}`);
        }
    }

    /**
     * Returns an array of IRIs of the graphs that contain a set of statements
     * @param statements The statements contained in one or more graphs
     * @returns The list of graphs that contain the statement
     */
    async getGraphsContainingStatements(statements: string): Promise<Array<string>> {
        const graphQuery = `
        SELECT ?graph WHERE {
            GRAPH ?graph {
                ${statements}
            }
        }`;

        const queryResult = await this.executeQuery(graphQuery);
        const bindings = queryResult.results.bindings;
        const graphIris = bindings.map(binding => binding.graph.value);
        if (graphIris.length == 0 ) {
            throw new Error("Error finding graphs. The given statements are not contained in a graph. Maybe they are spread over different graphs?");
        }
        return graphIris;
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
            throw new Error(`GraphDB error message: ${err.response.data}`);
        }
    }


    /**
     * Execute a query against the currently selected repository
     * @param {*} queryString The query to execute
     */
    private async executeSparqlRequest(
        queryString:string,
        contentType: string,
        accept = "application/sparql-results+json"): Promise<GraphDbResult | string>
    {
        const headers = {
            "Authorization": this.createBase64AuthString(),
            "Accept": accept,
            "Content-Type": contentType
        };

        try {
            const dbResponse = await Axios.post(
                this.getCurrentRepoEndpointString(),
                queryString,
                { 'headers': headers }
            );
            if (accept == 'text/turtle') {
                return dbResponse.data as string;
            } else {
                return dbResponse.data as GraphDbResult;
            }
        } catch (err) {
            console.log(err);

            if (err.response.status == 400) {       // On error: If its just a query mistake (graphdb 400) -> return this query mistake
                throw new Error(`Mistake in your query: ${err.response.data}`);
            } else {                                // On error: If something really went wrong: Throw error
                throw new Error(`Error while executing query: ${err}`);
            }
        }
    }

    executeConstruct(sparqlQuery: string): Promise<string> {
        return this.executeSparqlRequest(sparqlQuery, "application/sparql-query", "text/turtle") as Promise<string>;
    }

    executeQuery(sparqlQuery: string) : Promise<GraphDbResult> {
        return this.executeSparqlRequest(sparqlQuery, "application/sparql-query") as Promise<GraphDbResult>;
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
