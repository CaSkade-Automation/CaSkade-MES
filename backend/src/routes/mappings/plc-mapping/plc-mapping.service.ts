import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as FormData from 'form-data';
import Axios, { AxiosRequestConfig } from 'axios';
import { ModuleService } from '../../../routes/production-modules/module.service';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';
import { SkillService } from '../../skills/skill.service';


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
     * @param mtpFile File containing an MTP
     */
    async executeMapping(additionalData: AdditionalPlcMappingInfo, mtpFile: Express.Multer.File): Promise<string> {

        const formData = new FormData();
        formData.append('endpointUrl', additionalData.endpointUrl);
        formData.append('nodeIdRoot', additionalData.nodeIdRoot);
        formData.append("plc-file", fs.createReadStream(mtpFile.path), {filename: mtpFile.originalname});

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

export interface AdditionalPlcMappingInfo {
    endpointUrl: string,
    nodeIdRoot: string
}
