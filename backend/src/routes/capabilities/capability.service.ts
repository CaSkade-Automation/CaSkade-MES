import { Injectable, BadRequestException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { GraphDbConnectionService } from '../../util/GraphDbConnection.service';
import { CapabilityDto } from '@shared/models/capability/Capability';
import { capabilityMapping } from './capability-mappings';
import * as crypto from 'crypto';

import {SparqlResultConverter} from "sparql-result-converter";
import { CapabilitySocket } from '../../socket-gateway/capability-socket';
import { PropertyService, VDI3682RelationType } from '../properties/property.service';
import { SkillService } from '../skills/skill.service';
import { CapabilityType, ChangeCapabilityTypeDto } from '@shared/models/capability/CapabilityType';
import { ConstraintService } from '../constraints/constraint.service';
import { getCapabilityQueryString } from './capability-query';

const converter = new SparqlResultConverter();

@Injectable()
export class CapabilityService {
    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private propertyService: PropertyService,
        private capabilitySocket: CapabilitySocket,
        private constraintService: ConstraintService,
        @Inject(forwardRef(() => SkillService))
        private skillService: SkillService,
    ) { }

    /**
     * Registers a new capability in the graph DB
     * @param newCapability Rdf document describing the new capability
     */
    async addCapability(newCapability: string): Promise<void> {
        const capabilitiesBefore = await this.getAllCapabilities();
        try {
            // create a graph name for the capability (uuid)
            const capabilityGraphName = crypto.randomUUID();

            await this.graphDbConnection.addRdfDocument(newCapability, capabilityGraphName);
            const capabilitiesAfter = await this.getAllCapabilities();

            const newCapabilities = capabilitiesAfter.filter(
                capAfter => !capabilitiesBefore.some(capBefore => capBefore.iri === capAfter.iri));

            this.capabilitySocket.sendCapabilitiesAdded(newCapabilities);
            return;
        } catch (error) {
            throw new BadRequestException(`Error while registering a new capability. ${error}`);
        }
    }

    /**
     * Get all capabilities (optionally of a given type)
     * @param capabilityType Default: Capability. Can be set to either "CaSk:ProvidedCapability" or "CaSk: RequiredCapability" to filter for one or the other
     * @returns A list of capabilities
     */
    async getAllCapabilities(capabilityType = "http://www.w3id.org/hsu-aut/css#Capability"): Promise<Array<CapabilityDto>> {
        const typeFilter = `FILTER(EXISTS{?capability a <${capabilityType}>})`;
        const queryString = getCapabilityQueryString("", typeFilter);
        try {
            const queryResult = await this.graphDbConnection.executeQuery(queryString);
            const capabilities = converter
                .convertToDefinition(queryResult.results.bindings, capabilityMapping).getFirstRootElement() as Array<CapabilityDto>;

            for (const cap of capabilities) {
                await this.addPropertiesSkillsConstraints(cap);
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
        const iriFilter = `FILTER(?capability = IRI("${capabilityIri}")).`;
        const queryString = getCapabilityQueryString(iriFilter);
        try {
            const queryResult = await this.graphDbConnection.executeQuery(queryString);
            const capability = converter
                .convertToDefinition(queryResult.results.bindings, capabilityMapping, false).getFirstRootElement()[0] as CapabilityDto;

            await this.addPropertiesSkillsConstraints(capability);

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
        const resourceFilter = `<${moduleIri}> CSS:providesCapability ?capability.`;
        const queryString = getCapabilityQueryString(resourceFilter);
        try {
            const queryResult = await this.graphDbConnection.executeQuery(queryString);
            const capabilities = converter.convertToDefinition(queryResult.results.bindings, capabilityMapping)
                .getFirstRootElement() as Array<CapabilityDto>;

            for (const cap of capabilities) {
                await this.addPropertiesSkillsConstraints(cap);
            }

            return capabilities;
        } catch (error) {
            console.error(`Error while returning capabilities of module with IRI ${moduleIri}, ${error}`);
            throw new Error(error);
        }
    }

    /**
     * Adds all additional infos such as properties, skills and constraints to a capability
     * @param capability
     * @returns
     */
    private async addPropertiesSkillsConstraints(capability: CapabilityDto): Promise<CapabilityDto> {
        // add skills
        capability.skillDtos = await this.skillService.getSkillsForCapability(capability.iri);

        // add properties
        const capInputProperties = await this.propertyService
            .getPropertiesOfCapability(capability.iri, VDI3682RelationType['VDI3682:hasInput']);
        const capOutputProperties = await this.propertyService
            .getPropertiesOfCapability(capability.iri, VDI3682RelationType['VDI3682:hasOutput']);

        if (capInputProperties.length > 0) {
            capability.inputs.forEach(input => {
                const props = capInputProperties.filter(inputProp => inputProp.parentElement == input.iri);
                input.propertyDtos = props;
            });
        }

        if (capOutputProperties.length > 0) {
            capability.outputs.forEach(output=> {
                const props = capOutputProperties.filter(outputProp => outputProp.parentElement == output.iri);
                output.propertyDtos = props;
            });
        }

        //add constraints
        capability.constraints = await this.constraintService.getConstraintsOfCapability(capability.iri);

        return capability;
    }

    async changeCapabilityType(capabilityIri: string, changeCapabilityTypeInfo: ChangeCapabilityTypeDto): Promise<void> {
        // if change to provided, there must be a resource
        const {newType, providingResourceIri} = changeCapabilityTypeInfo;
        if (newType == CapabilityType.ProvidedCapability && !providingResourceIri) {
            throw new Error("Make sure to pass a resource in order to change a capability's type to provided");
        }

        let resourceString = "";
        if (newType == CapabilityType.ProvidedCapability) {
            resourceString = `<${providingResourceIri}> CSS:providesCapability <${capabilityIri}>.`;
        }

        // Query including optional resource string. Note: The query needs to insert the new type into the same graph as the old type
        // Otherwise deletion fails as it gets the graph in which the capability type declartion is made
        const sparqlUpdate = `
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        INSERT {
            GRAPH ?graph {
                <${capabilityIri}> a <${newType}>.
                ${resourceString}
            }
        } WHERE {
            GRAPH ?graph {
                <${capabilityIri}> a CSS:Capability.
            }
        }`;

        await this.graphDbConnection.executeUpdate(sparqlUpdate);
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
            // iterate over all graphs and clear every one
            const graphs = await this.getGraphsOfCapability(capabilityIri);

            const deleteRequests = new Array<Promise<void>>();
            graphs.forEach(graph => {
                deleteRequests.push(this.graphDbConnection.clearGraph(graph));
            });
            // wait for all graphs to be deleted before getting the remaining skills
            await Promise.all(deleteRequests);
            const capabilitiesAfterDeleting = await this.getAllCapabilities();
            this.capabilitySocket.sendCapabilityDeleted(capabilitiesAfterDeleting);
        } catch (error) {
            throw new InternalServerErrorException(
                `Error while trying to delete capability with IRI ${capabilityIri}. Error: ${error}`
            );
        }
    }

    /**
     * Returns the graph(s) that a capability is declared in
     * @param capabilityIri IRI of a capability to get graphs for
     * @returns Array of all graphs - typically only one entry
     */
    async getGraphsOfCapability(capabilityIri: string): Promise<Array<string>> {
        const capStatement = `<${capabilityIri}> a ?capClass.
            VALUES ?capClass {CSS:Capability CaSk:ProvidedCapability CaSk:RequiredCapability} .`;
        const graphs = await this.graphDbConnection.getGraphsContainingStatements(capStatement);
        return graphs;
    }
}
