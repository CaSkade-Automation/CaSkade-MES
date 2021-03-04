import { Injectable } from '@nestjs/common';
import Axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class MtpMappingService {

    private url: string;

    constructor() {
        this.url = "http://localhost:9191";
    }

    /**
     * Completely exchanges the host configuration against a new one
     * @param {*} newConfig The new host config (consisting of host, user, pw)
     */
    async setUrl(newUrl: string): Promise<string> {
        this.url = newUrl;
        return this.url;
    }

    /**
     * Returns the current URL
     */
    getUrl(): string {
        return this.url;
    }

    /**
     * Execute a mapping with a given file
     * @param mtpFile File containing an MTP
     */
    async executeMapping(mtpFile: Express.Multer.File): Promise<string> {
        const config: AxiosRequestConfig = {
            headers: {'Content-Type': 'multipart/form-data'}
        };
        return Axios.post(this.url, mtpFile, config);
    }

}
