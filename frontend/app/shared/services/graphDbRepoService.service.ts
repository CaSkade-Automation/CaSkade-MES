import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphDbRepoService {

  constructor(private httpClient: HttpClient) { }
  
  changeHost(newHostObj){
    return this.httpClient.put('/api/graph-repositories', newHostObj);
  }

  changeRepository(newRepoTitle:string) {
    const newRepo = {"selectedRepo" : newRepoTitle};
    return this.httpClient.patch('/api/graph-repositories/0', newRepo)
  }

  getRepositories() {
    return this.httpClient.get('/api/graph-repositories');
  }

  getCurrentRepository(): Observable<string> {
    return <Observable<string>>this.httpClient.get('/api/graph-repositories/0');
  }
}