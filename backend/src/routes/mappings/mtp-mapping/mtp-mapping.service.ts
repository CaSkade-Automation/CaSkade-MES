import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Axios, { AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';
import {MappingServiceConfig} from '@shared/models/mappings/MappingServiceConfig';
import { ModuleService } from '../../production-modules/module.service';
import { Request } from 'express';
import { SkillService } from '../../skills/skill.service';

@Injectable()
export class MtpMappingService {

    private config: MappingServiceConfig = {
        url: "http://localhost:9191"
    }


    constructor(
        private skillService: SkillService,
        private moduleService: ModuleService) {
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
    async executeMapping(mtpFile: Express.Multer.File): Promise<void> {
        const formData = new FormData();
        formData.append("mtp-file", fs.createReadStream(mtpFile.path), {filename: mtpFile.originalname});

        const reqConfig: AxiosRequestConfig = {
            headers: formData.getHeaders(),
            timeout: 1200000        // large timeout because mapping takes forever
        };

        Axios.post(this.config.url, formData, reqConfig)
            .then(res => {
                // Skills have to be registered separately so that state changes are tracked
                // But this is a very hacky fix to extract skills out of the module .ttl
                // there should be a better way ^^
                const mappedTurtleDocument = res.data as string;
                const skills = mappedTurtleDocument.match(/<.*> a .*Skill(>|;)/gi);
                this.moduleService.addModule(res.data);
                skills.forEach(skill => {
                    this.skillService.addSkill(skill + ".");
                });
            })
            .catch(err => {
                console.log("error on mapping");
                console.log(err);
            });

        return;
    }

}
