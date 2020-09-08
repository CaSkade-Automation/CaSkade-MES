import { Controller, Get, Put, Body, Patch } from "@nestjs/common";
import { GraphDbConnectionService, GraphDbConfig } from "../../util/GraphDbConnection.service";

import {SparqlResultConverter, MappingDefinition} from 'sparql-result-converter';
const converter = new SparqlResultConverter();

@Controller('graph-repositories')
export class GraphRepositoryController {

    constructor(private graphDbConnection: GraphDbConnectionService) { }

    repositoryMapping: MappingDefinition[] = [{
        rootName: 'repositories',
        propertyToGroup: 'uri',
        name: 'uri',
        toCollect: ['readable', 'writable', 'id', 'title'],
    },];

    /**
     * Returns all repositories at the currently connected graph DB
     */
     @Get()
    async getAllRepositories() {
        try {
            const repos = await this.graphDbConnection.getRepositories();
            const repositories = repos.data.results.bindings;

            const mappedRepositories = converter.convertToDefinition(repositories, this.repositoryMapping).getFirstRootElement();
            return mappedRepositories;
        } catch (error) {
            return {
                "msg": "Error while getting repositories",
                "error": error
            };
        }
    }


    /**
    * Returns the current configuration
    */
    @Get('/config')
     async getConfig(): Promise<GraphDbConfig> {
         return this.graphDbConnection.getConfig();
     }


    /**
    * Set a new host configuration
    * @param newConfig New config to set
    */
    @Put('/config')
    async setNewConfig(@Body() newConfig: GraphDbConfig): Promise<GraphDbConfig> {
        try {
            // make sure host has protocol set
            if (!newConfig.host.includes("://")) {
                newConfig.host = "http://" + newConfig.host;
            }

            const updatedConfig = await this.graphDbConnection.changeConfig(newConfig);
            return updatedConfig;

        } catch (error) {
            throw new Error(`Invalid config, error: ${error}`);
        }
    }


    /**
   * Update just one property of the config
   * @param propertyToUpdate The property that is going to be updated
   */
    @Patch('/config')
    updateConfig(@Body() propertyToUpdate: {}) {
        const reqKeys = Object.keys(propertyToUpdate);
        console.log(propertyToUpdate);


        if (reqKeys.length == 1 && this.graphDbConnection.config[reqKeys[0]] != undefined) {

            this.graphDbConnection.updateConfig(reqKeys[0], propertyToUpdate[reqKeys[0]]);

            return (this.graphDbConnection.config);
        } else {
            return ('Key doesn\' exist or more than one key given');
        }
    }

}

