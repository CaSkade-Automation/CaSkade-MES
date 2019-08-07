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
    return <Observable<DbConfig>>this.httpClient.get('/api/graph-repositories/config');
  }

  changeConfig(newConfig): Observable<DbConfig>{
    return <Observable<DbConfig>>this.httpClient.put('/api/graph-repositories/config', newConfig)
      .pipe(catchError((e:HttpErrorResponse) => {
      return throwError(e);
    }))
  }

  getRepositories(): Observable<String[]> {
    return <Observable<String[]>>this.httpClient.get('/api/graph-repositories');
  }

  changeRepository(newRepoTitle:string) {
    const newRepo = {"selectedRepo" : newRepoTitle};
    return this.httpClient.patch('/api/graph-repositories/config', newRepo)
  }
  
}



export interface DbConfig {
  host: string;
  user: string;
  password: string;
  selectedRepo: string;
}