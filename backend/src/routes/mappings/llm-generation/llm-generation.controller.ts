import { Body, Controller, Get, Post, Put, ServiceUnavailableException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LlmGenerationService } from './llm-generation.service';
import { Observable, catchError } from 'rxjs';
import { MappingServiceConfig } from '@shared/models/mappings/MappingServiceConfig';
import { LlmCapabilityGenerationDto } from '@shared/models/mappings/LlmGenerationRequestDto';


@Controller('mappings/llm')
export class LlmGenerationController {

    constructor(
        private llmGeneration: LlmGenerationService
    ){}

    @Get('ping')
    pingMappingApi(): Observable<void> {
        return this.llmGeneration.ping().pipe(
            catchError(
                err => {
                    throw new ServiceUnavailableException(null, "Service is not running. Make sure to start the LLM Generation Service.");
                })
        );
    }

    /**
     * Return the current URL of the MTP Mapping service
     */
    @Get('config')
    getConfig(): MappingServiceConfig {
        return this.llmGeneration.getConfig();
    }


    @Get('models')
    getModels(): Observable<Array<string>> {
        return this.llmGeneration.getModels();
    }


    /**
     * Add a new file to be mapped. Will be mapped directly using the MTP mapping service
     * @param file
     */
    @Put('config')
    changeConfig(@Body() newConfing: { url: string }): void {
        this.llmGeneration.setUrl(newConfing.url);
    }


    /**
     * Add a new file to be mapped. Will be mapped directly using the mapping service
     * @param file
     */
    @Post()
    generateCapability(@Body() llmCapabilityRequest: LlmCapabilityGenerationDto): Promise<{}> {
        return this.llmGeneration.generateCapability(llmCapabilityRequest);
    }

}
