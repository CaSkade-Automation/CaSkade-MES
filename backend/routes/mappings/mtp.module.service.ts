import { Injectable, BadRequestException } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import { SocketGateway } from '../../socket-gateway/socket.gateway';
import { v4 as uuidv4 } from 'uuid';


import {SparqlResultConverter} from 'sparql-result-converter';
import { SkillService } from '../skills/skill.service';
import { SocketEventName } from '@shared/socket-communication/SocketEventName';
const converter = new SparqlResultConverter();

@Injectable()
export class MtpModuleService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
     
        private socketService: SocketGateway) {}

    /**
     * Register a new module
     * @param newModule Content of an RDF document
     */
    // async addModule(file: File): Promise<string> {
    //     // create a graph name (uuid)
    //     return "MTP-Post done";
    

   
}
