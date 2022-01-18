import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';

@Injectable({
    providedIn: 'root'
})
export class PlcMappingService {

    baseApiRoute = '/api/mappings/plc';

    constructor(
        private httpClient: HttpClient
    ) { }


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
    executeMapping(plcFile: File, endpointUrl: string, nodeIdRoot: string): Observable<string> {


        const formData = new FormData();
        formData.append('endpointUrl', endpointUrl);
        formData.append('nodeIdRoot', nodeIdRoot);
        formData.append('plc-file', plcFile);

        const params = new HttpParams();

        const options = {
            params: params,
            reportProgress: true,
        };

        // const req = new HttpRequest('POST', url, formData, options);
        // return this.http.request(req);

        return this.httpClient.post(this.baseApiRoute, formData, options) as Observable<string>;
    }

}
