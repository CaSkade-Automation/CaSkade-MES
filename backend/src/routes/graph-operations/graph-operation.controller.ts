import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { GraphDbConnectionService, GraphDbResult } from "../../util/GraphDbConnection.service";
import { StringBody } from '../../custom-decorators/StringBodyDecorator';
import {NeighborRelation } from '@shared/models/graph-visualization/NeighborData';

@Controller('graph-operations')
export class GraphOperationController {

    constructor(private graphDbConnection: GraphDbConnectionService) { }

    /**
     * Send a new query to the current repository. Note: Using rawbody to allow for simple string body
     * @param queryString The query to run
     */
    @Post('/queries')
    async postQuery(@StringBody() queryString: string): Promise<GraphDbResult> {
        return this.graphDbConnection.executeQuery(queryString);
    }


    /**
     * Send a new statement to the current repository. Note: Using rawbody to allow for simple string body
     * @param statement The statement that will be sent against the graph DB
     * @param statementType Type of the statement. Should be either 'update' for a SPARQL update or 'document' for an
     */
    @Post('/statements')
    async postStatement(@StringBody() statement: string, @Query('type') statementType: string): Promise<any> {

        if (!statementType) {
            throw new Error("Missing parameter 'type'");
        } else {

            // Set correct contentType for GraphDB
            let contentType;
            switch (statementType) {
            case "updateString":
                contentType = "application/x-www-form-urlencoded";
                statement = `update=${statement}`;
                break;
            case "document":
                contentType = "application/x-turtle; charset=UTF-8";     // TODO: Get the real contentType, could also be RDF/XML
                break;
            }

            return this.graphDbConnection.executeStatement(statement, "", contentType);
        }
    }

    @Get('/neighbors/:individualIri')
    async getNeighbors(@Param('individualIri') individualIri: string): Promise<NeighborRelation[]> {
        const queryString = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        SELECT ?source ?relation ?target WHERE {
            {
                BIND(<${individualIri}> AS ?source).
                ?source ?relation ?target.}
            UNION {
                BIND(<${individualIri}> AS ?target).
                ?source ?relation ?target.
            }
            ?relation a owl:ObjectProperty.
        }`;

        const queryResult = await this.graphDbConnection.executeQuery(queryString);

        const neighborData = queryResult.results.bindings.map(binding => {
            const neighborData: NeighborRelation = {
                source: binding.source.value,
                relation: binding.relation.value,
                target: binding.target.value
            };
            return neighborData;
        });
        return neighborData;
    }

}
