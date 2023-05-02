import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as FormData from 'form-data';
import Axios, { AxiosRequestConfig } from 'axios';
import { ModuleService } from '../../../routes/production-modules/module.service';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';
import { SkillService } from '../../skills/skill.service';
import { PlcMappingRequest } from '../../../../../shared/src/models/mappings/PlcMappingRequest';


@Injectable()
export class PlcMappingService {

    private config: MappingServiceConfig = {
        url: "http://localhost:9191"
    }


    constructor(private skillService: SkillService) {
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

        Axios.post(this.config.url, formData, reqConfig)
            .then(res => {
                this.skillService.addSkill(res.data);
            })
            .catch(err => {
                console.log("error on mapping");
                console.log(err);
            });

        return;
    }


}

// File is handled separately on backend request, thus should not be used in the additional data object
export type PlcMappingRequestWithoutFile = Omit<PlcMappingRequest, "file">;
