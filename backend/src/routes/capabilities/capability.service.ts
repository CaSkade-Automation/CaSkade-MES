import { Injectable, BadRequestException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import { CapabilityDto } from '@shared/models/capability/Capability';
import { capabilityMapping } from './capability-mappings';
import * as crypto from 'crypto';

import {SparqlResultConverter} from "sparql-result-converter";
import { CapabilitySocket } from '../../socket-gateway/capability-socket';
import { BaseSocketMessageType } from '@shared/models/socket-communication/SocketData';
import { PropertyService } from '../properties/property.service';
import { SkillService } from '../skills/skill.service';

const converter = new SparqlResultConverter();

@Injectable()
export class CapabilityService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private propertyService: PropertyService,
        private capabilitySocket: CapabilitySocket,
        @Inject(forwardRef(() => SkillService))
        private skillService: SkillService,
    ) { }

    /**
     * Registers a new capability in the graph DB
     * @param newCapability Rdf document describing the new capability
     */
    async addCapability(newCapability: string): Promise<string> {
        const capabilitiesBefore = await this.getAllCapabilities();
        try {
            // create a graph name for the service (uuid)
            const capabilityGraphName = crypto.randomUUID();

            await this.graphDbConnection.addRdfDocument(newCapability, capabilityGraphName);
            const capabilitiesAfter = await this.getAllCapabilities();

            const newCapabilities = capabilitiesAfter.filter(
                capAfter => !capabilitiesBefore.some(capBefore => capBefore.iri === capAfter.iri));

            this.capabilitySocket.sendCapabilitiesAdded(newCapabilities);
            return 'New capability successfully added';
        } catch (error) {
            throw new BadRequestException(`Error while registering a new capability. Error: ${error}`);
        }
    }

    /**
     * Get all capabilities (optionally of a given type)
     * @param capabilityType Default: Capability. Can be set to either "CaSk:ProvidedCapability" or "CaSk: RequiredCapability" to filter for one or the other
     * @returns A list of capabilities
     */
    async getAllCapabilities(capabilityType = "http://www.w3id.org/hsu-aut/css#Capability"): Promise<Array<CapabilityDto>> {
        try {
            const queryResult = await this.graphDbConnection.executeQuery(`
            PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
            PREFIX VDI2860: <http://www.hsu-ifa.de/ontologies/VDI2860#>
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            PREFIX DIN8580: <http://www.hsu-ifa.de/ontologies/DIN8580#>
            PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
            SELECT ?capability ?input ?inputType ?output ?capabilityType ?processType WHERE {
                ?capability a CSS:Capability, ?capabilityType.
                Values ?capabilityType {CaSk:ProvidedCapability CaSk:RequiredCapability}
                OPTIONAL{
                    ?capability VDI3682:hasInput ?input.
                    ?input a ?inputType.
                    VALUES ?inputType {VDI3682:Energy VDI3682:Product VDI3682:Information}
                }
                OPTIONAL{
                    ?capability VDI3682:hasOutput ?output.
                    ?output a ?outputType.
                    VALUES ?outputType {VDI3682:Energy VDI3682:Product VDI3682:Information}
                }
                OPTIONAL{
                    ?capability a ?processType.
                    ?processType rdfs:subClassOf ?processParentType.
                    VALUES ?processParentType {DIN8580:Fertigungsverfahren VDI2860:Handhaben}
                    FILTER (NOT EXISTS{
                            ?someSubtype rdfs:subClassOf ?processType.
                        })
                }
                # Filter only relevant if specific type given
                FILTER(EXISTS{?capability a <${capabilityType}>})
            }`);
            const capabilities = converter
                .convertToDefinition(queryResult.results.bindings, capabilityMapping).getFirstRootElement() as Array<CapabilityDto>;
            // add skills
            for (const cap of capabilities) {
                cap.skillDtos = await this.skillService.getSkillsForCapability(cap.iri);
            }

            for (const cap of capabilities) {
                const capInputProperties = await this.propertyService.getInputPropertiesOfCapability(cap.iri);
                cap.inputs.map(input => {
                    const props = capInputProperties.filter(inputProp => inputProp.describedElementIri == input.iri);
                    input.propertyDtos = props;
                });
            }


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
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
            PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
            SELECT ?capability ?input ?output WHERE {
                ?capability a CSS:Capability.
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
            const capability = converter
                .convertToDefinition(queryResult.results.bindings, capabilityMapping).getFirstRootElement()[0] as CapabilityDto;

            capability.skillDtos = await this.skillService.getSkillsForCapability(capability.iri);
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
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
        SELECT ?capability ?input ?output WHERE {
            ?capability a CSS:Capability.
            <${moduleIri}> CSS:providesCapability ?capability.
            OPTIONAL {
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
            const capabilities = converter.convertToDefinition(queryResult.results.bindings, capabilityMapping)
                .getFirstRootElement() as Array<CapabilityDto>;

            for (const cap of capabilities) {
                cap.skillDtos = await this.skillService.getSkillsForCapability(cap.iri);
            }

            return capabilities;
        } catch (error) {
            console.error(`Error while returning capabilities of module with IRI ${moduleIri}, ${error}`);
            throw new Error(error);
        }
    }

    async deleteCapabilitiesOfModule(moduleIri: string): Promise<void> {
        const capabilities = await this.getCapabilitiesOfModule(moduleIri);
        capabilities.forEach(cap => {
            this.deleteCapability(cap.iri);
        });
    }


    /**
     * Delete a capability with a given IRI
     * @param capabilityIri IRI of the capability to delete
     */
    async deleteCapability(capabilityIri: string): Promise<void> {
        try {
            // First, delete all skills related to that capability:
            this.skillService.deleteSkillsOfCapability(capabilityIri);

            const query = `
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            SELECT ?capability ?graph WHERE {
                GRAPH ?graph {
                    BIND(IRI("${capabilityIri}") AS ?capability).
                    ?capability a CSS:Capability.
                }
            }`;

            const queryResult = await this.graphDbConnection.executeQuery(query);
            const queryResultBindings = queryResult.results.bindings;

            const deleteRequests = new Array<Promise<{statusCode: any; msg: any;}>>();
            // iterate over graphs and clear every one
            queryResultBindings.forEach(bindings => {
                const graphName = bindings.graph.value;
                deleteRequests.push(this.graphDbConnection.clearGraph(graphName));
            });

            // wait for all graphs to be deleted before getting the remaining skills
            await Promise.all(deleteRequests);
            const capabilitiesAfterDeleting = await this.getAllCapabilities();
            this.capabilitySocket.sendCapabilityDeleted(capabilitiesAfterDeleting);
        } catch (error) {
            throw new Error(
                `Error while trying to delete capability with IRI ${capabilityIri}. Error: ${error}`
            );
        }
    }

    // /**
    //  *
    //  * @param skillIri
    //  * @returns
    //  */
    // async getCapabilitiesOfSkill(skillIri: string): Promise<CapabilityDto[]> {
    //     try {
    //         const queryResult = await this.graphDbConnection.executeQuery(`
    //         PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
    //         PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
    //         SELECT ?capability ?input ?output WHERE {
    //             ?capability a Cap:Capability.
    //             ?capability Cap:isExecutableViaSkill <${skillIri}>
    //             OPTIONAL{
    //                 ?capability VDI3682:hasInput ?input.
    //                 ?input a ?fpbElement.
    //                 VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
    //             }
    //             OPTIONAL{
    //                 ?capability VDI3682:hasOutput ?output.
    //                 ?output a ?fpbElement.
    //                 VALUES ?fpbElement {VDI3682:Energy VDI3682:Product VDI3682:Information}
    //             }
    //         }`);
    //         const capabilities = converter.convertToDefinition(queryResult.results.bindings, capabilityMapping).getFirstRootElement() as CapabilityDto[];

    //         return capabilities;
    //     } catch (error) {
    //         console.error(`Error while returning capabilities of skill ${skillIri}, ${error}`);
    //         throw new Error(error);
    //     }
    // }
}
