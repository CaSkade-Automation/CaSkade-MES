import { Injectable } from "@nestjs/common";
import { GraphDbConnectionService } from "../../util/GraphDbConnection.service";
import { SkillSocket } from "../../socket-gateway/skill-socket";
import { MappingDefinition, SparqlResultConverter } from "sparql-result-converter";

@Injectable()
export class SkillStateService {

    private converter = new SparqlResultConverter();

    constructor(
        private graphDbConnection: GraphDbConnectionService,
        private skillSocket: SkillSocket
    ) {}


    async getStateInfo(skillIri: string): Promise<CurrentStateInfo> {
        const query = `
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
        PREFIX OpcUa: <http://www.w3id.org/hsu-aut/OpcUa#>
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
        PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
        PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
        SELECT ?output ?namespace ?nodeId ?assuredValue ?stateTypeIri
        WHERE {
            <${skillIri}> a CSS:Skill;
                CaSk:hasSkillOutput ?output.
            ?output a CaSk:CurrentStateOutput;
                    OpcUa:nodeId ?nodeId;
                    DINEN61360:is_Instance_Description_of_Data_Element ?de.		# Get Data_Element from actual value (skill output)

            OPTIONAL{?output OpcUa:nodeNamespace ?namespace}

            ?stateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
            ?stateIri a ?stateTypeIri.
            ?stateIri DINEN61360:has_Data_Element ?de.							# Get connected Data_Element from different states
            ?de DINEN61360:has_Instance_Description ?assuredInstance;
                DINEN61360:has_Type_Description CaSk:CurrentStateOutput_TD.
            ?assuredInstance DINEN61360:Expression_Goal "Assurance";
                            DINEN61360:Value ?assuredValue.
        }`;

        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, currentStateMapping)
            .getFirstRootElement()[0] as CurrentStateInfo;

        return mappedResult;
    }

    async getSkillState(skillIri: string): Promise<string> {
        const query = `
        PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
        SELECT ?state WHERE {
            <${skillIri}> CaSk:hasCurrentState ?state.
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const currentState = queryResult.results.bindings[0].state.value;
        return currentState;
    }

    prom = Promise.resolve();

    /**
     * Handles multiple state updates by chaining them to a promise so that quick sequential state updates will be preserved and done in order
     * @param skillIri state updates of this skill will be handled
     * @param newStateTypeIri The new state type after updating
     * @returns
     */
    async handleStateUpdates(skillIri: string, newStateTypeIri: string) {
        const promToReturn = this.prom
            .then(() => this.updateState(skillIri, newStateTypeIri));
        // continue the chain even if there's an error during one of them
        this.prom = promToReturn.catch((err) => err);
        // while returning the original Promise whose results and errors can be seen outside
        return promToReturn;
    }

    private async updateState(skillIri:string, newStateTypeIri: string): Promise<string> {
        try {
            const deleteQuery = `
            PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
            DELETE WHERE {
                <${skillIri}> CaSk:hasCurrentState ?oldCurrentState.
            }`;
            await this.graphDbConnection.executeUpdate(deleteQuery);

            // insert new state, make sure its in the skill's graph so that the delete mechanism works
            const insertQuery = `
            PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
            PREFIX CaSk: <http://www.w3id.org/hsu-aut/cask#>
            PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
            INSERT {
                GRAPH ?g {
                    <${skillIri}> CaSk:hasCurrentState ?newState.
                }
            } WHERE {
                GRAPH ?g {
                    <${skillIri}> CSS:behaviorConformsTo ?stateMachine.
                }
                ?stateMachine ISA88:hasState ?newState.
                ?newState a <${newStateTypeIri}>.
            }`;
            await this.graphDbConnection.executeUpdate(insertQuery);

            this.skillSocket.sendStateChanged(skillIri, newStateTypeIri);
            return `Sucessfully updated currentState of skill ${skillIri}`;
        } catch (error) {
            throw new Error(
                `Error while trying to update currentState of skill: ${skillIri}. Error: ${error}`
            );
        }
    }

}


class CurrentStateInfo {
    output: string;
    namespace: string;
    nodeId: string;
    values: {
        assuredValue: number;
        stateTypeIri: string;
    }[]
}



const currentStateMapping: MappingDefinition[] = [
    {
        rootName: 'skillExecutionInfos',
        propertyToGroup: 'output',
        name: 'output',
        toCollect: ['output', 'namespace', 'nodeId'],
        childMappings: [
            {
                rootName: 'values',
                propertyToGroup: 'assuredValue',
                name: 'assuredValue',
                toCollect: ['assuredValue','stateTypeIri'],
            },
        ]
    },

];

