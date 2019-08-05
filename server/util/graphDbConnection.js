const express = require('express');
const request = require('request');
const axios = require('axios');


module.exports = class GraphDbConnection {
    constructor(){
        this.host = "http://139.11.207.25:7200",
        this.user = "ops",
        this.password = "ops",
        this.selectedRepo = "OPS-GraphDB_TEST";
    }

    /**
     * Completely exchanges the host configuration against a new one
     * @param {*} newConfig The new host config (consisting of host, user, pw)
     */
    changeHost(newConfig) {
        this.host = newConfig.host;
        this.user = newConfig.user;
        this.password = newConfig.password;
    }

    getSelectedRepo() {
        return this.selectedRepo;
    }

    addRdfDocument(rdfDocument, context, callback) {
        const contentType = "application/rdf+xml";
        context = `?context=%3Curn:${context}%3E`;
        this.executeStatement(rdfDocument, context, contentType, callback);
    }

    
    clearGraph(graphName, callback) {
        console.log(`clearing graph name: ${graphName}`);
        
        const contentType = "application/x-www-form-urlencoded";
        const statement = `update=CLEAR GRAPH <${graphName}>`;
        console.log("complete statement:");
        console.log(statement);
        
        this.executeStatement(statement, "", contentType, callback);
    }
    

    executeStatement(statement, context, contentType, callback){
        // get all repositories of the graphdb
        console.log(this.getCurrentRepoEndpointString() + '/statements' + context)
        request.post({
            url: this.getCurrentRepoEndpointString() + '/statements' + context,
            headers: {
            "Authorization" : this.createBase64AuthString(),
            "Accept": "application/json",
            "Content-Type": contentType
            },
            body: statement
        },
        function (err, response, body) {
            if(err) {
                console.log(`Error while posting the rdfDocument to graphdDB`);
                callback('Error while posting the rdfDocument to graphdDB', null);
            } else if(response.statusCode == 415) {
                console.log(`Syntax error in RdfDocument.\nResponse of graphDb was`);
                callback('Syntax error in RdfDocument', null)
            } else{
                console.log(`Statement executed successfully.\nResponse of grapDb was:`);
                // console.dir(response);
                callback(null, true);
            }
        });
    }
    
    
    executeQuery(queryString, callback){
        request.post({
            url: this.getCurrentRepoEndpointString(),
            headers: {
            "Authorization" : this.createBase64AuthString(),
            "Accept": "application/sparql-results+json",
            "Content-Type": "application/sparql-query"
            },
            body: queryString
        },
        function (err, response, body) {
            if(err) {
                //console.log(`error: ${err}`);
                callback(err, null)
            } else if (response.statusCode != 200){
                //console.log(`body: ${body}`);
                //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                callback(null, body);
            } else{
                callback(null, body);
            }
        });
    }

    getRepositoriesEndpoint() {
        let repositoriesEndpoint = this.host + "/repositories";
        return repositoriesEndpoint;
    }


    async getRepositories() {
        // get all repositories of the graphdb
        try {
            const response = axios.get(this.getRepositoriesEndpoint(),{
                headers: {
                "Authorization" : this.createBase64AuthString(),
                "Accept": "application/json"
                }
            });
            return response;
        }
        catch (error) {
            return error;
        }
    }
    

    getCurrentRepoEndpointString() {
        let repoEndpoint = this.getRepositoriesEndpoint() + "/" + this.selectedRepo;
        return repoEndpoint;
    }

    createBase64AuthString(){
        let authString = new Buffer.from(this.user + ":" + this.password);  
        let authStringBase64 = "Basic " + authString.toString('base64');
        return authStringBase64
    }
}

