import { Body, Controller, Get, Post, Put, ServiceUnavailableException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';
import { PlcMappingRequestWithoutFile, PlcMappingService } from './plc-mapping.service';
import { Observable, catchError, map } from 'rxjs';


@Controller('mappings/plc')
export class PlcMappingController {

    constructor(private mappingService: PlcMappingService){}

    @Get('ping')
    pingMappingApi(): Observable<void> {
        return this.mappingService.ping().pipe(
            catchError(err => {throw new ServiceUnavailableException(null, "Service is not running. Make sure to start the Plc2Skill REST API.");})
        );
    }

    /**
     * Return the current URL of the MTP Mapping service
     */
    @Get('config')
    getConfig(): MappingServiceConfig {
        return this.mappingService.getConfig();
    }


    /**
     * Add a new file to be mapped. Will be mapped directly using the MTP mapping service
     * @param file
     */
    @Put('config')
    changeConfig(@Body() newConfing: { url: string }): void {
        this.mappingService.setUrl(newConfing.url);
    }


    /**
     * Add a new file to be mapped. Will be mapped directly using the mapping service
     * @param file
     */
    @Post()
    @UseInterceptors(FileInterceptor('plc-file'))
    uploadFile(@Body() additionalData: PlcMappingRequestWithoutFile, @UploadedFile() file: Express.Multer.File): Promise<string> {
        return this.mappingService.executeMapping(additionalData, file);
    }

}
