import { Injectable } from '@nestjs/common';
import Axios, { AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';
import {MappingServiceConfig} from '@shared/models/mappings/MappingServiceConfig';
import { ModuleService } from '../../production-modules/module.service';
import { Request } from 'express';

@Injectable()
export class MtpMappingService {

    private config: MappingServiceConfig = {
        url: "http://localhost:9191"
    }


    constructor(private moduleService: ModuleService) {
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
    async executeMapping(mtpFile: Express.Multer.File): Promise<string> {
        const formData = new FormData();
        formData.append("mtp-file", fs.createReadStream(mtpFile.path), {filename: mtpFile.originalname});

        const reqConfig: AxiosRequestConfig = {
            headers: formData.getHeaders(),
            timeout: 1200000        // large timeout because mapping takes forever
        };

        Axios.post(this.config.url, formData, reqConfig)
            .then(res => {
                console.log("mapping completed");
                console.log(res.data);
                this.moduleService.addModule(res.data);
            })
            .catch(err => {
                console.log("error on mapping");
                console.log(err);
            });

        return;
    }

}
