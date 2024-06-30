import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, Observable, take, tap } from 'rxjs';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';
import { LlmCapabilityGenerationDto } from '@shared/models/mappings/LlmGenerationRequestDto';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})
export class LlmGenerationService {

    baseApiRoute = '/api/mappings/llm';

    constructor(
        private httpClient: HttpClient,
        private messageService: MessageService
    ) { }


    isConnected(): Observable<HttpResponse<void>> {
        const pingUrl = `${this.baseApiRoute}/ping`;
        return this.httpClient.get<void>(pingUrl, { observe: 'response' }).pipe(take(1));
    }

    /**
	 * Change the URL of the LLM generation webservice
	 * @param newUrl New URL of the LLM generation webservice
	 */
    changeUrl(newUrl: string): Observable<string> {
        return this.httpClient.put(`${this.baseApiRoute}/config`, {url: newUrl}) as Observable<string>;
    }


    /**
	 * Get the current URL of the LLM generation service
	 * @returns Current URL of the LLM generation service
	 */
    getConfig(): Observable<MappingServiceConfig> {
        return this.httpClient.get<MappingServiceConfig>(`${this.baseApiRoute}/config`);
    }

    /**
     * Get all models
     */
    getModels(): Observable<Array<string>> {
        const url = `${this.baseApiRoute}/models`;
        return this.httpClient.get<Array<string>>(url).
            pipe(
                take(1),
                catchError((err: HttpErrorResponse) => {
                    this.messageService.warn("Error while loading models", err.error.message);
                    throw new Error(err.message);
                })
            );
    }

    /**
	 * Generate a capability from natural-language text
	 * @param plcFile MTP file that will be mapped
	 * @returns The mapped module with skills in turtle syntax
	 */
    generateCapability(capabilityDesscription: string, model: string): Observable<string> {
        const capabilityGenerationDto =  new LlmCapabilityGenerationDto(model, capabilityDesscription);
        const options = {
            reportProgress: true,
        };

        return this.httpClient.post(this.baseApiRoute, capabilityGenerationDto, options) as Observable<string>;
    }
}
