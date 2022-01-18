import { Body, Controller, Get, Post,  Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { MtpMappingService } from './mtp-mapping.service';
import {MappingServiceConfig} from '@shared/models/mappings/MappingServiceConfig';
import { Request } from 'express';

@Controller('mappings/mtp')
export class MtpMappingController {

    constructor(
        private mtpMappingService: MtpMappingService) {
    }


    /**
     * Return the current URL of the MTP Mapping service
     */
    @Get('config')
    getConfig(): MappingServiceConfig {
        return this.mtpMappingService.getConfig();
    }


    /**
     * Add a new file to be mapped. Will be mapped directly using the MTP mapping service
     * @param file
     */
    @Put('config')
    changeConfig(@Body() newConfing: {url:string}): void {
        this.mtpMappingService.setUrl(newConfing.url);
    }


    /**
     * Add a new file to be mapped. Will be mapped directly using the MTP mapping service
     * @param file
     */
    @Post()
    @UseInterceptors(FileInterceptor('mtp-file'))
    uploadFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<void> {
        return this.mtpMappingService.executeMapping(file);
    }


}
