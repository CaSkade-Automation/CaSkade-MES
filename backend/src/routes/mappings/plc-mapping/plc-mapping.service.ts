import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as FormData from 'form-data';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';
import { SkillService } from '../../skills/skill.service';
import { PlcMappingRequest } from '../../../../../shared/src/models/mappings/PlcMappingRequest';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, map, of } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { ModuleService } from '../../production-modules/module.service';
import { CapabilityService } from '../../capabilities/capability.service';


@Injectable()
export class PlcMappingService {

    private config: MappingServiceConfig = {
        url: "http://localhost:9191"
    }


    constructor(
        private moduleService: ModuleService,
        private skillService: SkillService,
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

    /**
     * Execute a mapping with a given file
     * @param plcFile File containing an MTP
     */
    async executeMapping(additionalData: PlcMappingRequestWithoutFile, plcFile: Express.Multer.File): Promise<string> {

        const formData = new FormData();
        formData.append('endpointUrl', additionalData.endpointUrl);
        formData.append('baseIri', additionalData.baseIri);
        formData.append('user', additionalData.user);
        formData.append('password', additionalData.password);
        formData.append('resourceIri', additionalData.resourceIri);
        formData.append('nodeIdRoot', additionalData.nodeIdRoot);
        formData.append("plc-file", fs.createReadStream(plcFile.path), {filename: plcFile.originalname});

        const reqConfig: AxiosRequestConfig = {
            headers: formData.getHeaders(),
            timeout: 1200000        // large timeout because mapping takes forever
        };

        this.http.post(this.config.url, formData, reqConfig).pipe(
            catchError(err => {
                console.log("error on mapping");
                console.log(err);
                return of(err);
            })).
            subscribe(res => {
                switch (additionalData.context) {
                case "production-modules": this.moduleService.addModule(res.data, "text/turtle");
                    break;
                case "skills": this.skillService.addSkills(res.data, "text/turtle");
                    break;
                case "capabilities": this.capabilityService.addCapability(res.data);
                    break;
                }
            });

        return;
    }


}

// File is handled separately on backend request, thus should not be used in the additional data object
export type PlcMappingRequestWithoutFile = Omit<PlcMappingRequest, "file">;
