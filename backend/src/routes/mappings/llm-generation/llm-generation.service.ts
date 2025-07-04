import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, lastValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import { CapabilityService } from '../../capabilities/capability.service';
import { LlmCapabilityGenerationDto } from '@shared/models/mappings/LlmCapabilityGenerationDto';


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
            catchError((err:AxiosError) => {
                throw new InternalServerErrorException("Could not connect to the LLM Service. Make sure it's running and you have the port set correctly.");
            }),
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
        const res = await lastValueFrom(this.http.post<string>(this.config.url, llmCapabilityRequest).pipe(
            catchError((err: AxiosError) => {
                console.log("error during LLM capability generation");
                console.log(err);
                throw new Error(err.message);
            }),
            map(res => res.data)
        ));

        await this.capabilityService.addCapability(res);


        return {msg: "Capability successfully registered"};
    }


}
