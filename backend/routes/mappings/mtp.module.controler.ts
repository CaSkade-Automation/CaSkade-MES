import { Controller, Get, Post,  UploadedFile, UseInterceptors } from '@nestjs/common';

import {FileInterceptor} from '@nestjs/platform-express';

import { MtpModuleService } from './mtp.module.service';

@Controller('Mtp')
export class MtpModuleController {

    constructor(
     private mtpModuleService: MtpModuleService) {}

    
    // @Post()
    // async addModule(@StringBody() newModule: string): Promise<string> {
    //     return this.moduleService.addModule(newModule);
    // }
    @Post()
 
     @UseInterceptors( 
         FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {
        console.log(file); 
         
    }

    @Get()
    testget(){
        const msg="Test hat funktioniert";
        return msg;
    }

   
}
