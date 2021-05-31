// const express = require('express');
// const axios = require('axios');


// module.exports = class GraphDbConnection {
//     constructor() {
//         this.host = "http://139.11.207.25:7200",
//         this.user = "ops",
//         this.password = "ops",
//         this.selectedRepo = "OPS-GraphDB_TEST";
//     }

//     /**
//    * Completely exchanges the host configuration against a new one
//    * @param {*} newConfig The new host config (consisting of host, user, pw)
//    */
//     async changeConfig(newConfig) {
//         const oldConfig = {
//             "host": this.host,
//             "user": this.user,
//             "password": this.password,
//             "selectedRepo": this.selectedRepo
//         };

//         this.setConfig(newConfig);

//         // Make sure this configuration is valid
//         await this.getRepositories().then(repos => {
//             return newConfig;
//         }).catch(err => {
//             // in case of error: return to old config
//             this.setConfig(oldConfig);
//             throw new Error(err);
//         });
//     }

//     getConfig() {
//         const config = {
//             "host": this.host,
//             "user": this.user,
//             "password": this.password,
//             "selectedRepo": this.selectedRepo
//         };
//         return config;
//     }

//     setConfig(newConfig) {
//         Object.keys(newConfig).forEach(key => {
//             this[key] = newConfig[key];
//         });
//     }

//     getSelectedRepo() {
//         return this.selectedRepo;
//     }

//     async addRdfDocument(rdfDocument, context) {
//         const contentType = "application/rdf+xml";
//         context = `?context=%3Curn:${context}%3E`;
//         return this.executeStatement(rdfDocument, context, contentType);
//     }


//     /**
//    * Deletes all content from a given graph
//    * @param {*} graphName Name of the graph to be deleted
//    * @param {*} callback function(err, graphDbResponse) that gets called after clearing the graph
//    */
//     async clearGraph(graphName) {
//         const contentType = "application/x-www-form-urlencoded";
//         const statement = `update=CLEAR GRAPH <${graphName}>`;
//         return this.executeStatement(statement, "", contentType);
//     }


//     /**
//    * Executes a statement against the current repository of the graph database
//    * @param {*} statement Statement to execute
//    * @param {*} context Context (=graph) that the statement is executed in
//    * @param {*} contentType Content type of the statement (either application/rdf+xml for update strings or application/x-www-form-urlencoded for an rdf document)
//    */
//     async executeStatement(statement, context, contentType) {
//         const url = this.getStatementEndpointString(context);

//         const headers = {
//             'Authorization': this.createBase64AuthString(),
//             'Accept': 'application/json',
//             'Content-Type': contentType
//         };


//         try {
//             const dbResponse = await axios.post(
//                 url,
//                 statement,
//                 {'headers': headers});
//             return dbResponse.data;

//         } catch (err) {
//             if (err.response.status == 400) {       // On error: If its just a query mistake (graphdb 400) -> return this query mistake
//                 throw new Error(`Mistake in your statement: ${err.response.data}`);
//             } else {                                // On error: If something really went wrong: Throw error
//                 throw new Error(`Error while executing statement: ${err}`);
//             }
//         }
//     }


//     /**
//  * Execute a query against the currently selected repository
//  * @param {*} queryString The query to execute
//  */
//     async executeQuery(queryString) {
//         const headers = {
//             "Authorization": this.createBase64AuthString(),
//             "Accept": "application/sparql-results+json",
//             "Content-Type": "application/sparql-query"
//         };

//         try {
//             const dbResponse = await axios.post(
//                 this.getCurrentRepoEndpointString(),
//                 queryString,
//                 {'headers': headers}
//             );
//             return dbResponse.data;                 // Everything ok -> return the response body (data)
//         } catch (err) {
//             if (err.response.status == 400) {       // On error: If its just a query mistake (graphdb 400) -> return this query mistake
//                 throw new Error(`Mistake in your query: ${err.response.data}`);
//             } else {                                // On error: If something really went wrong: Throw error
//                 throw new Error(`Error while executing query: ${err}`);
//             }
//         }
//     }


//     /**
//  * Create a string pointing to all repositories at the current graphdb
//  */
//     getRepositoriesEndpoint() {
//         const repositoriesEndpoint = this.host + "/repositories";
//         return repositoriesEndpoint;
//     }


//     /**
//  * Get all repositories of the currently selected graphdb
//  */
//     async getRepositories() {
//         try {
//             const response = axios.get(this.getRepositoriesEndpoint(), {
//                 headers: {
//                     "Authorization": this.createBase64AuthString(),
//                     "Accept": "application/json"
//                 }
//             });
//             return response;
//         } catch (error) {
//             return error;
//         }
//     }


//     /**
//  * Get the currently selected repository endpoint
//  */
//     getCurrentRepoEndpointString() {
//         const repoEndpoint = this.getRepositoriesEndpoint() + "/" + this.selectedRepo;
//         return repoEndpoint;
//     }


//     /**
//  * Returns the current statement endpoint string with a given context
//  * @param {*} context The context (aka named graph) that a statement is to be added to
//  */
//     getStatementEndpointString(context="") {
//         let endpointString = `${this.getCurrentRepoEndpointString()}/statements`;
//         if(context !== "") {
//             endpointString += `${context}`;
//         }
//         return endpointString;
//     }




//     /**
//  * Create Base64-encrypted auth string for graphDb authentication
//  */
//     createBase64AuthString() {
//         const authString = new Buffer.from(this.user + ":" + this.password);
//         const authStringBase64 = "Basic " + authString.toString('base64');
//         return authStringBase64;
//     }
// };