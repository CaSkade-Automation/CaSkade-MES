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
        // Request has to be sent as multipart/form-data
        const formData = new FormData();
        formData.append("deployment-name", req.deploymentName);
        formData.append("enable-duplicate-filtering", req.enableDuplicateFiltering.toString());
        formData.append("deploy-changed-only", req.deployChangedOnly.toString());
        formData.append("deployment-source", "local");

        // XML has to be converted to a file
        const blob = new Blob([req.data], { type: 'text/plain' });
        const file = new File([blob], "bpmnFile",);
        formData.append("bpmnFile", file, "bpmnFile.bpmn");

        return this.http.post<any>(this.engineRestRoot, formData);
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
