import { Injectable } from '@nestjs/common';
import Axios, { AxiosRequestConfig } from 'axios';
import {MtpMappingServiceConfig} from '@shared/models/mappings/MtpMappingServiceConfig';

@Injectable()
export class MtpMappingService {

    private config: MtpMappingServiceConfig = {
        url: "http://localhost:9191"
    }


    constructor() {
    }

    /**
     * Set a new URL
     * @param {*} newUrl The new URL of the mapping service
     */
    setUrl(newUrl: string): MtpMappingServiceConfig {
        this.config.url = newUrl;
        return this.config;
    }

    /**
     * Returns the current URL
     */
    getConfig(): MtpMappingServiceConfig{
        return this.config;
    }

    /**
     * Execute a mapping with a given file
     * @param mtpFile File containing an MTP
     */
    async executeMapping(mtpFile: Express.Multer.File): Promise<string> {
        const reqConfig: AxiosRequestConfig = {
            headers: {'Content-Type': 'multipart/form-data'}
        };
        return Axios.post(this.config.url, mtpFile, reqConfig);
    }

}
