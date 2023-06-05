import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable, take, tap } from 'rxjs';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';
import { PlcMappingRequest } from '@shared/models/mappings/PlcMappingRequest';

@Injectable({
    providedIn: 'root'
})
export class PlcMappingService {

    baseApiRoute = '/api/mappings/plc';

    constructor(
        private httpClient: HttpClient
    ) { }


    isConnected(): Observable<HttpResponse<any>> {
        const pingUrl = `${this.baseApiRoute}/ping`;
        return this.httpClient.get<any>(pingUrl, { observe: 'response' }).pipe(take(1), tap(val => console.log(val)));
    }

    /**
	 * Change the URL of the MTP mapping webservice
	 * @param newUrl New URL of the mto mapping service
	 */
    changeUrl(newUrl: string): Observable<string> {
        return this.httpClient.put(`${this.baseApiRoute}/config`, {url: newUrl}) as Observable<string>;
    }


    /**
	 * Get the current URL of the MTP mapping service
	 * @returns Current URL of the MTP mapping service
	 */
    getConfig(): Observable<MappingServiceConfig> {
        return this.httpClient.get(`${this.baseApiRoute}/config`) as Observable<MappingServiceConfig>;
    }


    /**
	 * Execute a mapping
	 * @param plcFile MTP file that will be mapped
	 * @returns The mapped module with skills in turtle syntax
	 */
    executeMapping(mappingRequest: PlcMappingRequest): Observable<string> {
        const formData = new FormData();
        formData.append('endpointUrl', mappingRequest.endpointUrl);
        formData.append('plc-file', mappingRequest.file);
        formData.append('baseIri', mappingRequest.baseIri);
        formData.append('resourceIri', mappingRequest.resourceIri);
        formData.append('nodeIdRoot', mappingRequest.nodeIdRoot);
        formData.append('user', mappingRequest.user);
        formData.append('password', mappingRequest.password);
        formData.append('context', mappingRequest.context);

        const options = {
            reportProgress: true,
        };

        // const req = new HttpRequest('POST', url, formData, options);
        // return this.http.request(req);

        return this.httpClient.post(this.baseApiRoute, formData, options) as Observable<string>;
    }
}
