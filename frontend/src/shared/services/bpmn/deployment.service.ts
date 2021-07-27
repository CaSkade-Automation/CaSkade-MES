import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeploymentService {

    engineRestRoot = "/engine-rest/deployment/create";

    constructor(private http: HttpClient) { }

    deployProcess(req: DeploymentRequest): Observable<any> {
        return this.http.post<any>(this.engineRestRoot, req);
    }
}

export class DeploymentRequest {

    constructor(
        public deploymentName: string,
        public deploymentSource: string,
        public data: any,
        public enableDuplicateFiltering?: boolean,
        public deployChangedOnly?: boolean,
        public tenantId?: string,
    ) {}


}
