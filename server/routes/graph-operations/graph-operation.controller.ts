import * as rawbody from 'raw-body';
import { Controller, Body, Post, Query, Req } from "@nestjs/common";
import { GraphDbConnectionService, GraphDbResult } from "util/GraphDbConnection.service";

@Controller('graph-operations')
export class GraphOperationController {

  constructor(private graphDbConnection: GraphDbConnectionService) { }

  /**
   * Send a new query to the current repository. Note: Using rawbody to allow for simple string body
   * @param queryString The query to run
   */
  @Post('/queries')
  async postQuery(@Req() req): Promise<GraphDbResult> {
      const rawBody = await rawbody(req);
      const queryString = rawBody.toString().trim();

      return this.graphDbConnection.executeQuery(queryString);
  }


  /**
   * Send a new statement to the current repository. Note: Using rawbody to allow for simple string body
   * @param statement The statement that will be sent against the graph DB
   * @param statementType Type of the statement. Should be either 'update' for a SPARQL update or 'document' for an
   */
  @Post('/statements')
  async postStatement(@Req() req, @Query('type') statementType: string) {

    const rawBody = await rawbody(req);
    let statement = rawBody.toString().trim();

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
          contentType = "application/rdf+xml";
          break;
      }

      return this.graphDbConnection.executeStatement(statement, "", contentType)
    }
  }

}
