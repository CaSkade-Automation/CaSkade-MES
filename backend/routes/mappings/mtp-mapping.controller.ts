import { Body, Controller, Get, Post,  Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { MtpMappingService } from './mtp-mapping.service';
import * as Request from 'express';
import {MtpMappingServiceConfig} from '@shared/models/mappings/MtpMappingServiceConfig';

@Controller('mappings')
export class MtpMappingController {

    constructor(
        private mtpMappingService: MtpMappingService) {
    }


    /**
     * Return the current URL of the MTP Mapping service
     */
    @Get('mtp/config')
    getConfig(): MtpMappingServiceConfig {
        return this.mtpMappingService.getConfig();
    }


    /**
     * Add a new file to be mapped. Will be mapped directly using the MTP mapping service
     * @param file
     */
    @Put('mtp/config')
    changeConfig(@Body() newConfing: {url:string}): void {
        this.mtpMappingService.setUrl(newConfing.url);
    }


    /**
     * Add a new file to be mapped. Will be mapped directly using the MTP mapping service
     * @param file
     */
    @Post('mtp')
    @UseInterceptors(FileInterceptor('mtp-file'))
    uploadFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<string> {
        return this.mtpMappingService.executeMapping(file, req.headers);
    }


}
