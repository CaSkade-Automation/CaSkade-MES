import { AttributeIds,
    ClientMonitoredItem,
    ClientSession,
    ClientSubscription,
    DataValue,
    MonitoringParametersOptions,
    NodeId,
    NodeIdType,
    ReadValueIdOptions,
    TimestampsToReturn } from "node-opcua";
import { GraphDbConnectionService } from "./GraphDbConnection.service";
import {MappingDefinition, SparqlResultConverter} from 'sparql-result-converter';
import { Injectable } from "@nestjs/common";
import { take } from "rxjs/operators";
import { HttpService } from "@nestjs/axios";

/**
 *  A state change monitor that keeps track of state changes for OpcUaVariableSkills. This type of skill doesn't communicate changes in state.
 */
@Injectable()
export class OpcUaStateMonitorService {

    subscription: ClientSubscription;
    converter = new SparqlResultConverter();


    constructor(
        private httpService: HttpService,
        private graphDbConnection: GraphDbConnectionService) {
        this.graphDbConnection = graphDbConnection;
    }

    public async setupItemToMonitor(session: ClientSession, skillIri: string): Promise<void> {

        this.subscription = ClientSubscription.create(session, {
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 100,
            requestedMaxKeepAliveCount: 10,
            maxNotificationsPerPublish: 100,
            publishingEnabled: true,
            priority: 10
        });
        const currentStateInfo = await this.getCurrentStateInfo(skillIri);

        // TODO: Same code as in OpcUaSkillExecutor, should be moved to a common place
        let nsIndex: number;
        let nodeId: NodeId;
        try {
            nodeId = NodeId.resolveNodeId(currentStateInfo.nodeId);
            nsIndex = nodeId.namespace;
        } catch (error) {
            // if nodeId cannot be resolved, try to do it manually
            let nsIndex = Number(currentStateInfo.namespace);    // namespace could also be stored as index
            if(!nsIndex) {
                nsIndex = session.getNamespaceIndex(currentStateInfo.namespace);  // if not stored as index, try to get index
            }
            nodeId = new NodeId(NodeIdType.STRING, currentStateInfo.nodeId, nsIndex);
        }

        // install monitored item
        const itemToMonitor: ReadValueIdOptions = {
            nodeId: nodeId,
            attributeId: AttributeIds.Value
        };
        const parameters: MonitoringParametersOptions = {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10
        };

        const monitoredItem = ClientMonitoredItem.create(
            this.subscription,
            itemToMonitor,
            parameters,
            TimestampsToReturn.Both
        );

        monitoredItem.on("changed", (dataValue: DataValue) => {
            const newState = (currentStateInfo.values.find(value => value.assuredValue == dataValue.value.value)).stateTypeIri;

            // Send a post to the skill state change route to update the state and trigger all functions (e.g. websocket communication)
            const skillChangeRoute = `/skills/${encodeURIComponent(skillIri)}/states`;
            this.httpService.patch(skillChangeRoute, {'newState': newState}).pipe(take(1)).subscribe();
        });
        console.log("item to monitor set up");

    }



    async getCurrentStateInfo(skillIri: string): Promise<CurrentStateInfo> {
        const query = `
        PREFIX Cap: <http://www.hsu-ifa.de/ontologies/capability-model#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
        PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
        PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
        SELECT ?output ?namespace ?nodeId ?assuredValue ?stateTypeIri
        WHERE {
            <${skillIri}> a Cap:Skill;
                Cap:hasSkillOutput ?output.
            ?output a Cap:CurrentStateOutput;
                    OpcUa:nodeNamespace ?namespace;
                    OpcUa:nodeId ?nodeId;
                    DINEN61360:is_Instance_Description_of_Data_Element ?de.		# Get Data_Element from actual value (skill output)

            ?stateTypeIri sesame:directSubClassOf/sesame:directSubClassOf ISA88:State.
            ?stateIri a ?stateTypeIri.
            ?stateIri DINEN61360:has_Data_Element ?de.							# Get connected Data_Element from different states
            ?de DINEN61360:has_Instance_Description ?assuredInstance;
                DINEN61360:has_Type_Description Cap:CurrentStateOutput_TD.
            ?assuredInstance DINEN61360:Expression_Goal "Assurance";
                            DINEN61360:Value ?assuredValue.
        }`;

        const queryResult = await this.graphDbConnection.executeQuery(query);
        const mappedResult = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, currentStateMapping).getFirstRootElement()[0] as CurrentStateInfo;

        return mappedResult;
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
