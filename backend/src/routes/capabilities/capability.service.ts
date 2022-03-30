import { Injectable, BadRequestException } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import { CapabilityDto } from '@shared/models/capability/Capability';
import { capabilityMapping } from './capability-mappings';
import { v4 as uuidv4 } from 'uuid';

import {SparqlResultConverter} from "sparql-result-converter";
import { CapabilitySocket } from '../../socket-gateway/capability-socket';
import { SocketMessageType } from '@shared/socket-communication/SocketData';

const converter = new SparqlResultConverter();

@Injectable()
export class CapabilityService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private capabilitySocket: CapabilitySocket
    ) { }

    /**
     * Registers a new capability in the graph DB
     * @param newCapability Rdf document describing the new capability
     */
    async addCapability(newCapability: string): Promise<string> {
        try {
            // create a graph name for the service (uuid)
            const capabilityGraphName = uuidv4();

            await this.graphDbConnection.addRdfDocument(newCapability, capabilityGraphName);
            this.capabilitySocket.sendMessage(SocketMessageType.Added);
            return 'New capability successfully added';
        } catch (error) {
            throw new BadRequestException(`Error while registering a new capability. Error: ${error.tostring()}`);
        }
    }

    /**
     * Returns all currently registered capabilities (optionally with their in- and outputs)
     */
    async getAllCapabilities(): Promise<Array<CapabilityDto>> {
        try {
            const queryResult = await this.graphDbConnection.executeQuery(`
            PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
            PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            SELECT ?capability ?input ?output WHERE {
                ?capability a Cap:Capability.
                OPTIONAL{
                    ?capability VDI3682:hasInput ?input.
                    ?input a ?fpbElement.
                    VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
                }
                OPTIONAL{
                    ?capability VDI3682:hasOutput ?output.
                    ?output a ?fpbElement.
                    VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
                }
            }`);
            const capabilities = converter.convertToDefinition(queryResult.results.bindings, capabilityMapping).getFirstRootElement() as Array<CapabilityDto>;
            return capabilities;
        } catch (error) {
            console.error(`Error while returning all capabilities, ${error}`);
            throw new Error(error);
        }
    }

    /**
     * Gets a specific capability by its IRI
     * @param capabilityIri IRI of the capability to get
     */
    async getCapabilityByIri(capabilityIri: string): Promise<CapabilityDto> {
        try {
            const queryResult = await this.graphDbConnection.executeQuery(`
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            SELECT ?capability ?input ?output WHERE {
                ?capability a Cap:Capability.
                FILTER(?capability = IRI("${capabilityIri}")).
                OPTIONAL{
                    ?capability VDI3682:hasInput ?input.
                    ?input a ?fpbElement.
                    VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
                }
                OPTIONAL{
                    ?capability VDI3682:hasOutput ?output.
                    ?output a ?fpbElement.
                    VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
                }
            }`);
            const capability = converter.convertToDefinition(queryResult.results.bindings, capabilityMapping).getFirstRootElement()[0] as CapabilityDto;
            return capability;
        } catch (error) {
            console.error(`Error while returning capability with IRI ${capabilityIri}, ${error}`);
            throw new Error(error);
        }
    }

    /**
     * Returns all capabilities of a module
     * @param moduleIri IRI of the module to get all capabilities of
     * @returns
     */
    async getCapabilitiesOfModule(moduleIri: string): Promise<CapabilityDto[]> {
        const query = `
        PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
        PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
        SELECT ?capability ?skillIri ?input ?output WHERE {
            ?capability a Cap:Capability;
                Cap:isExecutableViaSkill ?skillIri.
            <${moduleIri}> Cap:hasCapability ?capability.
            OPTIONAL{
                ?capability VDI3682:hasInput ?input.
                ?input a ?fpbElement.
                VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
            }
            OPTIONAL{
                ?capability VDI3682:hasOutput ?output.
                ?output a ?fpbElement.
                VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
            }
        }`;

        try {
            const queryResult = await this.graphDbConnection.executeQuery(query);
            const capabilities = converter.convertToDefinition(queryResult.results.bindings, capabilityMapping).getFirstRootElement() as Array<CapabilityDto>;
            return capabilities;
        } catch (error) {
            console.error(`Error while returning capabilities of module with IRI ${moduleIri}, ${error}`);
            throw new Error(error);
        }
    }


    /**
     * Delete a capability with a given IRI
     * @param capabilityIri IRI of the capability to delete
     */
    async deleteCapability(capabilityIri: string): Promise<string> {
        try {
            const query = `
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            SELECT ?capability ?graph WHERE {
                GRAPH ?graph {
                    BIND(IRI("${capabilityIri}") AS ?capability).
                    ?capability a Cap:Capability.
                }
            }`;

            const queryResult = await this.graphDbConnection.executeQuery(query);
            const queryResultBindings = queryResult.results.bindings;

            // iterate over graphs and clear every one
            queryResultBindings.forEach(bindings => {
                const graphName = bindings.graph.value;
                this.graphDbConnection.clearGraph(graphName);
            });
            return `Sucessfully deleted capability with IRI ${capabilityIri}`;
        } catch (error) {
            throw new Error(
                `Error while trying to delete capability with IRI ${capabilityIri}. Error: ${error}`
            );
        }
    }

    /**
     *
     * @param skillIri
     * @returns
     */
    async getCapabilitiesOfSkill(skillIri: string): Promise<CapabilityDto[]> {
        try {
            const queryResult = await this.graphDbConnection.executeQuery(`
            PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
            PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
            SELECT ?capability ?input ?output WHERE {
                ?capability a Cap:Capability.
                ?capability Cap:isExecutableViaSkill <${skillIri}>
                OPTIONAL{
                    ?capability VDI3682:hasInput ?input.
                    ?input a ?fpbElement.
                    VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
                }
                OPTIONAL{
                    ?capability VDI3682:hasOutput ?output.
                    ?output a ?fpbElement.
                    VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
                }
            }`);
            const capabilities = converter.convertToDefinition(queryResult.results.bindings, capabilityMapping).getFirstRootElement() as CapabilityDto[];
            return capabilities;
        } catch (error) {
            console.error(`Error while returning capabilities of skill ${skillIri}, ${error}`);
            throw new Error(error);
        }
    }
}
