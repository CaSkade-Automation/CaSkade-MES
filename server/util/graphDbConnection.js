var express = require('express');
var router = express.Router();
var request = require('request');


module.exports = class GraphDbConnection {
    constructor(){
        this.dbConfig = {
            "host": "http://139.11.207.25:7200",
            "user": "ops",
            "pw": "ops",
            "selectedDB":"OPS-GraphDB_TEST",
        }
    }
    
    addRdfDocument(rdfDocument, callback){
        // get all repositories of the graphdb
        request.post({
            url: this.getCurrentRepoEndpointString() + '/statements',
            headers: {
            "Authorization" : this.createBase64AuthString(),
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
            },
            body: rdfDocument
        },
        function (err, response, body) {
            if(err) {
                console.log(`Error while posting the rdfDocument to graphdDB.\nError: ${err}`);
                callback(null, 'Error while posting the rdfDocument to graphdDB');
            } else if(response.statusCode == 415) {
                console.log(`Syntax error in RdfDocument.\nResponse of graphDb was: ${response}`);
                callback(null, 'Syntax error in RdfDocument')
            } else{
                console.log(`RdfDocument posted successfully.\nResponse of grapDb was: ${response}`);
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                callback(true, null);
            }
        });
    }
    
    
    executeQuery(queryString, callback){
        console.log(queryString);
        
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
                console.log(`error: ${err}`);
                callback(null, err)
            } else if (response.statusCode != 200){
                console.log(`body: ${body}`);
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                callback(null, body);
            } else{
                callback(body, null);
            }
        });
    }

    getRepositoriesEndpoint() {
        let repositoriesEndpoint = this.dbConfig.host + "/repositories";
        return repositoriesEndpoint;
    }

    getCurrentRepoEndpointString() {
        let repoEndpoint = this.getRepositoriesEndpoint() + "/" + this.dbConfig.selectedDB;
        return repoEndpoint;
    }

    createBase64AuthString(){
        let authString = new Buffer.from(this.dbConfig.user + ":" + this.dbConfig.pw);  
        let authStringBase64 = "Basic " + authString.toString('base64');
        return authStringBase64
    }
}

