import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GraphDbRepoService {

    baseRoute = "/api/graph-repositories";

    constructor(private httpClient: HttpClient) { }

    isConnected(): Observable<HttpResponse<any>> {
        return this.httpClient.get<any>(this.baseRoute, { observe: 'response' }).pipe(first());
    }

    getCurrentConfig(): Observable<DbConfig> {
        const url = `${this.baseRoute}/config`;
        return this.httpClient.get(url) as Observable<DbConfig>;
    }

    changeConfig(newConfig): Observable<DbConfig>{
        const url = `${this.baseRoute}/config`;
        return this.httpClient.put(url, newConfig)
            .pipe(catchError((e: HttpErrorResponse) => {
                return throwError(e);
            })) as Observable<DbConfig>;
    }

    getRepositories(): Observable<GraphDbRepositoryInfo[]> {
        return this.httpClient.get(this.baseRoute) as Observable<GraphDbRepositoryInfo[]>;
    }

    changeRepository(newRepoId: string): Observable<Record<string, any>> {
        const newRepo = {"selectedRepo" : newRepoId};
        const url = `${this.baseRoute}/config`;
        return this.httpClient.patch(url, newRepo);
    }

}

export interface DbConfig {
    host: string;
    user: string;
    password: string;
    selectedRepo: string;
}

export interface GraphDbRepositoryInfo {
    id: string;
    readable: string;
    title: string;
    uri: string;
    writable: string;
}
