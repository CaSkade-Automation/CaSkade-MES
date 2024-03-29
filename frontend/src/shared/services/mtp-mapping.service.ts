import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import {MappingServiceConfig} from '@shared/models/mappings/MappingServiceConfig';

@Injectable({
    providedIn: 'root'
})
export class MtpMappingService {

    baseApiRoute = '/api/mappings/mtp';

    constructor(
        private httpClient: HttpClient
    ) { }

    isConnected(): Observable<HttpResponse<any>> {
        return this.httpClient.get<any>(this.baseApiRoute, { observe: 'response' }).pipe(first());
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
	 * @param mtpFile MTP file that will be mapped
	 * @returns The mapped module with skills in turtle syntax
	 */
    executeMapping(mtpFile, context: string): Observable<string> {


        const formData = new FormData();
        formData.append('mtp-file', mtpFile);
        formData.append('context', context);

        const options = {
            reportProgress: true,
        };

        // const req = new HttpRequest('POST', url, formData, options);
        // return this.http.request(req);

        return this.httpClient.post(this.baseApiRoute, formData, options) as Observable<string>;
    }

}
