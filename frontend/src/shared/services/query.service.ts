import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { D3GraphData } from '../../modules/graph-visualization/D3GraphData';
import { Observable } from 'rxjs';
import { NeighborRelation } from '@shared/models/graph-visualization/NeighborData';

@Injectable({
    providedIn: 'root'
})
export class QueryService {

    baseUrl = '/api/graph-operations';

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
    getNeighbors(individualIri: string): Observable<NeighborRelation[]> {
        const encodedIri = encodeURIComponent(individualIri);
        const url = `${this.baseUrl}/neighbors/${encodedIri}`;
        return this.httpClient.get<NeighborRelation[]>(url);
    }

}
