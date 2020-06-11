import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  apiRoute = '/api/graph-operations';

  constructor(private httpClient: HttpClient) { }


  // TODO: Write all these functions

  /**
   * Can be used to run a SPARQL-query with an arbitrary query string against the connected graph DB
   * @param queryString The SPARQL-query-string
   */
  query(queryString: string) { }

  /**
   * Can be used to run a SPARQL update operation with an arbitrary update string against the connected graph DB
   * @param updateString The SPARQL-UPDATE-string
   */
  update(updateString: string) { }


  /**
   * Returns an individual's neighbors // TODO: Query could be in backend, this should then be part of another service
   * @param individualIri IRI of the individual to get the neighbors of
   */
  getNeighbors(individualIri: string): NeighborRelation[] {
    const fakeNeighbors: NeighborRelation[] = [{
      objectPropertyName: "hasComponent",
      neighborName: "someComponent",
      neighborType: "Component",
      direction: Direction.outgoing
    }, {
      objectPropertyName: "hasInput",
      neighborName: "input1",
      neighborType: "Product",
      direction: Direction.outgoing
    },
    {
      objectPropertyName: "executesProces",
      neighborName: "machine1",
      neighborType: "TechnicalResource",
      direction: Direction.incoming
    }];

    return fakeNeighbors;
  }

}

interface NeighborRelation {
  objectPropertyName: string;
  neighborName: string;
  neighborType: string;
  direction: Direction;
}

enum Direction {
  "incoming", "outgoing"
}
