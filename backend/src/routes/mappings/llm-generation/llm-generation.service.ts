import { Injectable } from '@nestjs/common';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, lastValueFrom, map, of, tap } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { CapabilityService } from '../../capabilities/capability.service';
import { LlmCapabilityGenerationDto } from '@shared/models/mappings/LlmGenerationRequestDto';


@Injectable()
export class LlmGenerationService {

    private config: MappingServiceConfig = {
        url: "http://localhost:9292"
    }


    constructor(
        private capabilityService: CapabilityService,
        private http: HttpService
    ) {}

    /**
     * Simple ping to see if the server is running
     * @returns Status code
     */
    ping(): Observable<void>{
        const pingUrl = `${this.config.url}/ping`;
        return this.http.get<void>(pingUrl).pipe(map(res => res.data));
    }

    /**
     * Set a new URL
     * @param {*} newUrl The new URL of the mapping service
     */
    setUrl(newUrl: string): MappingServiceConfig {
        this.config.url = newUrl;
        return this.config;
    }

    /**
     * Returns the current URL
     */
    getConfig(): MappingServiceConfig{
        return this.config;
    }

    getModels(): Observable<Array<string>> {
        const url = `${this.config.url}/models`;
        return this.http.get<Array<string>>(url).pipe(
            catchError(err => {throw new Error(err.toString());}),
            map(res => res.data));
    }

    /**
     * Execute a mapping with a given file
     * @param plcFile File containing an MTP
     */
    async generateCapability(llmCapabilityRequest: LlmCapabilityGenerationDto): Promise<{}> {
        // const reqConfig: AxiosRequestConfig = {
        //     timeout: 1200000        // large timeout because mapping takes forever
        // };
        console.log("generating cap");

        const res = await lastValueFrom(this.http.post<string>(this.config.url, llmCapabilityRequest).pipe(
            catchError((err) => {
                console.log("error during LLM capability generation");
                console.log(err);
                throw new Error(err.message);
            }),
            map(res => res.data)
        ));

        //TODO: Continue here. Request ends at LLM-Rest-API (java). But JSon needs to be properly read. And add error handling in frontend
        console.log("returning");
        console.log(res);
        try {
            await this.capabilityService.addCapability(res);
        } catch (error) {
            console.log("error while trying to register capability");
            console.log(error);

        }

        return {msg: "Capability successfully registered"};
    }


}
