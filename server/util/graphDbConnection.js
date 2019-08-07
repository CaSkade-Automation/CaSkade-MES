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
    async changeConfig(newConfig) {
        const oldConfig = {
            "host": this.host,
            "user": this.user,
            "password": this.password,
            "selectedRepo": this.selectedRepo
        }
        
        this.setConfig(newConfig);

        // Make sure this configuration is valid
        await this.getRepositories().then(repos => {
            console.log("repos in changeConfig");
            
            console.log(repos);
            return newConfig;
        }).catch(err => {
            // in case of error: return to old config
            console.log("error in changeConfig");
            
            this.setConfig(oldConfig);
            throw new Error(err);
        });
    }

    getConfig() {
        const config = {
            "host": this.host,
            "user": this.user,
            "password": this.password,
            "selectedRepo": this.selectedRepo
        }
        return config;
    }

    setConfig(newConfig) {
        Object.keys(newConfig).forEach(key => {
            this[key] = newConfig[key];
        });                
    }

    getSelectedRepo() {
        return this.selectedRepo;
    }

    addRdfDocument(rdfDocument, context, callback) {
        const contentType = "application/rdf+xml";
        context = `?context=%3Curn:${context}%3E`;
        this.executeStatement(rdfDocument, context, contentType, callback);
    }

    
    /**
     * Deletes all content from a given graph
     * @param {*} graphName Name of the graph to be deleted
     * @param {*} callback function(err, graphDbResponse) that gets called after clearing the graph
     */
    clearGraph(graphName, callback) {
        const contentType = "application/x-www-form-urlencoded";
        const statement = `update=CLEAR GRAPH <${graphName}>`;
        this.executeStatement(statement, "", contentType, callback);
    }
    

    /**
     * Executes a statement against the current repository of the graph database
     * @param {*} statement Statement to execute
     * @param {*} context Context (=graph) that the statement is executed in
     * @param {*} contentType Content type of the statement (either application/rdf+xml for update strings or application/x-www-form-urlencoded for an rdf document)
     * @param {*} callback function(err, graphDbResponse) that gets called after clearing the graph
     */
    executeStatement(statement, context, contentType, callback){
        request.post({
            url: this.getCurrentRepoEndpointString() + '/statements' + context,
            headers: {
            "Authorization" : this.createBase64AuthString(),
            "Accept": "application/json",
            "Content-Type": contentType
            },
            body: statement
        },
        function (err, graphDbResponse) {
            callback(err, graphDbResponse)
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
        function (err, graphDbResponse) {
            if(err) {
                callback(err);
            }else if(graphDbResponse.statusCode == 200) {
                callback(false, graphDbResponse.body);
            } else {
                callback(true, graphDbResponse.body);
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

