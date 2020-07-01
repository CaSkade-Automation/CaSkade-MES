# Ontology based planning system
A web based plattform to manage automated modules based on semantic descriptions.  
The platform consists of two parts: 
- NestJS-Backend: The backend is connected with a graph database and provides core functions for modules (registering, adding capabilites, executing services, executing queries against the graph database)
- Angular-Fronted: The frontend provides a user interface to interact with connected modules (e.g. to execute their services)


#### Setup & Install
- Clone this repository (via SSH) into a folder on your computer
- The folder contains three folders:
  - Backend: A separate project (npm package) containing all the backend stuff
  - Frontend: A separate project (npm package) containing all the frontend stuf
  - Shared: A library containing classes that are used by both back- and frontend
- Note that you have to install dependencies for both backend and frontend and run these two separately, e.g. in two different terminals. The commands described below start backend and frontend in "watch-mode" where changes lead to a restart of backend / frontend. No need to manually restart the server or refresh your browser's page.


##### Running the backend
To run the backend, execute the following commands **inside the "backend"-folder**:
- When first running, make sure to install all dependencies via `npm install`
- To start the backend, execute npm run server-start 

##### Running the frontend
To run the frontend, execute the following commands **inside the "frontend"-folder**:
- When first running, make sure to install all dependencies via `npm install`
- To start the frontend, execute npm run `npm run ng-serve`


## API-Documentation
### Table of contents
1. [Modules and related capabilities](#modules)
2. [Orders](#orders)
3. [Services and Capabilities](#services)
4. [Service Execution](#service-execution)
5. [Queries and statements](#queries)
6. [Repository management](#repository-management)

<a id="modules"></a>

### Modules
The following backend routes can bes used to manage modules and their capabilities.
#### Getting all modules
Example request:
```
GET /api/modules    HTTP 1.1
```

Returns an array of modules. Currently the only element of each object is the module's IRI. Example response:
```
HTTP/1.1 200 OK

[
    {
        "name": "http://a0-88-b4-a2-04-bc#ModuleA"
    },
    {
        "name": "http://00-ff-30-54-1c-9e#ModuleA"
    },
    ...
]
```
#### Adding Modules
New modules can be added by sending an rdf-document (XML encoded) that describes the module. Example request:
```
POST /api/modules    HTTP 1.1
Content-Type: text/plain

<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
	xmlns="http://www.hsu-ifa.de/WADL#"
	xmlns:wgs="http://www.w3.org/2003/01/geo/wgs84_pos#"
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
...
</rdf:RDF>
```

Currently, there is only a simple confirmation. Example response:
```
HTTP/1.1 201 CREATED

"Module successfully registered"
```

### Removing Modules
A module (identified by it's IRI) can simply be deleted. Consequently, all services of the module are also deleted. Note that the moduleIri has to sent in a urlencoded way. For a module with IRI http://00-ff-30-54-1c-9e#ModuleA, the request looks like:
```
DELETE /api/modules/http%3A%2F%2F00-ff-30-54-1c-9e%23ModuleA   HTTP 1.1
```

No actual response is given, just status code 204
```
HTTP/1.1 204 NO CONTENT
```

### Getting a module's capabilities
A capability describes possible actions that a module might be able to do. These capabilities can be manufacturing processes or pure IT-related actions. Note that a capability doesn't have to be executable. A capability might have a connection to a function or service that allows execution.  
Example request to get all capabilities of a module (note again that the module IRI has to be urlencoded):

```
GET /api/modules/http%3A%2F%2F00-ff-30-54-1c-9e%23ModuleA/capabilities   HTTP 1.1
```

The request returns an array of all the capabilities a module provides. In cases where there is an executable service / function connected to a capability, this service / function is also contained in the response. Example:
```
HTTP/1.1 200 OK

[
    {
        "name": "http://a0-88-b4-a2-04-bc#GeometryCheckProcess",
        "methods": [
            {
                "name": "http://a0-88-b4-a2-04-bc#GeometryCheck",
                "resourcesBase": "http://139.11.207.185:8181",
                "resourcePath": "/GeometryChecker",
                "methodType": "http://www.hsu-ifa.de/ontologies/WADL#POST",
                "parameters": [
                    {
                        "fullName": "http://a0-88-b4-a2-04-bc#GeometryCheckingParameter",
                        "paramDataType": "xsd:string",
                        "paramName": "Downloadlink",
                        "paramType": "http://www.hsu-ifa.de/ontologies/WADL#QueryParameter",
                        "paramLocation": "body"
                    }
                ]
            }
        ]
    },
    {
        "name": "http://a0-88-b4-a2-04-bc#DeleteProcess"
    }
]
```

### Adding new capabilities to a module
New capabilities can be added to a module. All that's needed is an rdf document containing a description of the new capability. Note that the rdf document has to contain the relation between module and capability. Example request for adding a capability to a module with IRI http://00-ff-30-54-1c-9e#ModuleA:

```
POST /api/modules/http%3A%2F%2F00-ff-30-54-1c-9e%23ModuleA/capabilities   HTTP 1.1
Content-Type: text/plain

<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
	xmlns="http://www.hsu-ifa.de/WADL#"
	xmlns:wgs="http://www.w3.org/2003/01/geo/wgs84_pos#"
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
...
</rdf:RDF>
```

Response:
```
HTTP/1.1 201 CREATED

"New capability successfully added"
```
<a id="orders"></a>
### Orders
A "customer" can enter an order inquiry via the OPS. Orders can be created, retrieved and deleted with the following backend routes:

... Under construction

<a id="services"></a>

### Capabilities & Services
In [Modules and their capabilities](#modules), there was already shown how to get the capabilities and services of one specific module. It sometimes may be beneficial to get all capabilities of all currently connected modules and maybe find a capability that matches certain criteria. Therefore, capabilities and connected services can be retrieved without having a specific module. This is shown in the following subsections:

... Under Construction

<a id="service-execution"></a>
### Service Execution
Services can be seen as "executable capabilities". This subsections provides ways to get all scheduled executions as well as create new ones. (NOTE: Currently, executions can just be added and are executed right away. There is no scheduling)

### Adding a new service execution
A new service execution can be added by taking a WADL service descrtiption and filling out the parameters. Example request:

```
POST /api/service-executions   HTTP 1.1
{ 
    fullPath: 'IP-Adresse/GeometryChecker',
    methodType: 'POST' 
    parameters:
        [ 
            { 
                name: 'Downloadlink',
                type: 'QueryParameter',
                dataType: 'xsd:string',
                location: 'body',
                value: 'http://localhost:9090/uploaded-files/Beispieldatei.txt'
            }
        ],
}
```
<a id="queries"></a>
### Queries and statements against the graph database
Besides all the higher-level functionality of managing modules and their capabilities, the OPS also provides ways to directly interact with the underlying graph database. Please note that graph database differ between 'queries' and 'statements'. While the former provide only read-access (i.e. allow executing SELECT-queries), the latter can usually be used for both read and write access.  
Please also note that all requests are executed against the currently selected repository. Furthermore, all requests are sent via HTTP POSTs, as it is easier and safer to transfer larger queries in a request body as opposed to sending the query as a URL query parameter. 


#### Executing queries
SELECT-queries can be executed as shown in the following example. Note that the query can simply be sent as plain text in the request body:
```
POST /api/graph-operations/queries   HTTP 1.1

PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
SELECT ?s WHERE {
    ?s a VDI2206:System.
}
```

The response contains a typical GraphDB response, a table-like JSON object that contains a description of the variables inside of `head` and an array of results inside `results.bindings`. Watch out, to safe some bytes, the GraphDB response does not contain empty values. In cases where one child object would have an empty value, the whole child object is left away. Example response for the query above:

```
HTTP/1.1 200 OK

{
    "head": {
        "vars": [
            "s"
        ]
    },
    "results": {
        "bindings": [
            {
                "s": {
                    "type": "uri",
                    "value": "VDI2206:mySystem"
                }
            },
            ...
```

#### Executing statements
Statements can be used for the purpose of adding data to a graph database. This can be done in two different ways:
1. By adding data with a SPARQL-UPDATE operation
2. By adding data that is described in an rdf document

The OPS provides routes for both these ways. To execute a SPARQL UPDATE, just sent the update-query as a body to .../statements and set the query parameter type to updateString. A request looks like this:

```
POST /api/graph-operations/statements?type=updateString     HTTP 1.1
Content-Type: text/plain

PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
INSERT DATA {
	<VDI2206:mySystem> a VDI2206:System.
}
```

Unfortunately, the GraphDB doesn't give much as a response. It only returns a 204 without any content. The OPS just returns this response, so the response looks like:

```
HTTP/1.1 204 NO CONTENT
```

To add data via a rdf-document, the query looks quite similar. The only thing different is that type has to be set to "document" and that a document has to be sent in the request body. Look at the example below:

```
POST /api/graph-operations/statements?type=document     HTTP 1.1
Content-Type: text/plain

<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
	xmlns="http://www.hsu-ifa.de/ontologies/DINEN61360#"
	xmlns:owl="http://www.w3.org/2002/07/owl#"
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"

	<owl:NamedIndividual rdf:about="http://www.hsu-ifa.de/ontologies/VDI2206#mySystem">
        <rdf:type rdf:resource="http://www.hsu-ifa.de/ontologies/VDI2206#System"/>
    </owl:NamedIndividual>
	...
</rdf:RDF>
```

The response is just the same as above, so:
```
HTTP/1.1 204 NO CONTENT
```

<a id="repository-management"></a>
### Managing the connected graph database
The OPS also provides ways to manage the connected database. The following subsections show how to use the corresponding API routes.

#### Getting all repositories
Returns a JSON array of all repositories of the connected graph database:
Request:
```
GET /api/graph-repositories     HTTP 1.1
```

Response:
```
HTTP/1.1 200 OK

[
    {
        "uri": "http://139.11.207.25:7200/repositories/OPS_WADL-TestDB",
        "readable": "true",
        "writable": "true",
        "id": "OPS_WADL-TestDB",
        "title": "OPS_WADL-TestDB"
    },
   ...
]
```

#### Get the current config
Getting the current config is quite simple. Note that the password is sent without encryption -> this is only used for testing now:
Request:
```
GET /api/graph-repositories/config     HTTP 1.1
```

Response:
```
HTTP/1.1 200 OK

{
    "host": "http://139.11.207.25:7200",
    "user": "ops",
    "password": "ops",
    "selectedRepo": "OPS-GraphDB_TEST"
}
```

#### Change the current config
Changing the config is as easy as retrieving it. Note that sending a repository here is optional:
Request:
```
PUT /api/graph-repositories/config     HTTP 1.1

{
    "host": "http://139.11.207.25:7200",
    "user": "yyyyy",
    "password": "xxxxx",
    "selectedRepo": "OPS-GraphDB_TEST"
}
```

In case the config is correct (i.e. there is a graph db running on this endpoint):
```
HTTP/1.1 200 OK

Config successfully changed
```

In case the config is incorrect (i.e. no graph db running on this endpoint):
```
HTTP/1.1 400 BAD REQUEST

Invalid config
```

#### Changing a single property of the config
Instead of changing a complete config, you can also just change a single property (e.g. the selected repository) of the config. The following example shows how:
```
PATCH /api/graph-repositories/config     HTTP 1.1

{
    "selectedRepo": "OPS-GraphDB_TEST"
}
```

In case the property exists, the new config is returned:
```
HTTP/1.1 200 OK

{
    "host": "http://139.11.207.25:7200",
    "user": "yyyyy",
    "password": "xxxxx",
    "selectedRepo": "OPS-GraphDB"
}
```
