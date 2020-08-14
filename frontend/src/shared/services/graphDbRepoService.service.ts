import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GraphDbRepoService {

    constructor(private httpClient: HttpClient) { }


    getCurrentConfig(): Observable<DbConfig> {
        return this.httpClient.get('/api/graph-repositories/config') as Observable<DbConfig>;
    }

    changeConfig(newConfig): Observable<DbConfig>{
        return this.httpClient.put('/api/graph-repositories/config', newConfig)
            .pipe(catchError((e: HttpErrorResponse) => {
                return throwError(e);
            })) as Observable<DbConfig>;
    }

    getRepositories(): Observable<GraphDbRepositoryInfo[]> {
        return this.httpClient.get('/api/graph-repositories') as Observable<GraphDbRepositoryInfo[]>;
    }

    changeRepository(newRepoId: string) {
        const newRepo = {"selectedRepo" : newRepoId};
        return this.httpClient.patch('/api/graph-repositories/config', newRepo);
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
