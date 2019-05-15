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
    
    addRdfDocument(rdfDocument){
        // get all repositories of the graphdb
        request.post({
            url: this.getCurrentRepoEndpointString(),
            headers: {
            "Authorization" : this.createBase64AuthString(),
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
            },
            body: rdfDocument
        },
        function (err, response, body) {
            if(err) {
                console.log(`error: ${err}`);
            }
            else{
            console.log('body' + body);
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            }
        });
    }
    
    executeQuery(queryString){
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
            }
            else{
                console.log(`body: ${body}`);
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            
            }
        });
    }

    getCurrentRepoEndpointString() {
        let repoEndpoint = this.dbConfig.host + "/repositories/" + this.dbConfig.selectedDB;
        console.log(repoEndpoint);
        
        return repoEndpoint;
    }

    createBase64AuthString(){
        let authString = new Buffer.from(this.dbConfig.user + ":" + this.dbConfig.pw);  
        let authStringBase64 = "Basic " + authString.toString('base64');
        return authStringBase64
    }
}

