import { AttributeIds, ClientMonitoredItem, ClientSession,
    ClientSubscription, DataValue, MonitoringParametersOptions,
    NodeId, NodeIdType, ReadValueIdOptions, TimestampsToReturn } from "node-opcua";
import { Injectable } from "@nestjs/common";
import { OpcUaSessionManager } from "./OpcUaSessionManager";
import { SkillStateService } from "../routes/skill-states/skill-state.service";

@Injectable()
export class OpcUaStateTrackerManager {

    private stateTrackers = new Map<string, Promise<ClientMonitoredItem>>();


    constructor(
        private uaSessionManager: OpcUaSessionManager,
        private skillStateService: SkillStateService
    ) {}

    public getStateTracker(skillIri: string): Promise<ClientMonitoredItem> {
        console.log("get state tracker for skillIri: " + skillIri);
        console.log("available trakcers: " + this.stateTrackers.size);

        let tracker = this.stateTrackers.get(skillIri);
        console.log("tracker");
        console.log(tracker);

        if (!tracker) {
            console.log("creating new tracker");

            tracker = this.createTracker(skillIri);
        }
        return tracker;
    }


    private async createTracker(skillIri: string): Promise<ClientMonitoredItem> {
        const uaSession = await this.uaSessionManager.getSession(skillIri);
        const subscription = ClientSubscription.create(uaSession, {
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 100,
            requestedMaxKeepAliveCount: 10,
            maxNotificationsPerPublish: 100,
            publishingEnabled: true,
            priority: 10
        });
        const currentStateInfo = await this.skillStateService.getCurrentStateInfo(skillIri);

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
                nsIndex = uaSession.getNamespaceIndex(currentStateInfo.namespace);  // if not stored as index, try to get index
            }
            nodeId = new NodeId(NodeIdType.STRING, currentStateInfo.nodeId, nsIndex);
        }

        // install monitored item
        const itemToMonitor: ReadValueIdOptions = {
            nodeId: nodeId,
            attributeId: AttributeIds.Value
        };

        console.log("item to monitor");
        console.log(itemToMonitor);


        const parameters: MonitoringParametersOptions = {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10
        };

        const monitoredItem = ClientMonitoredItem.create(
            subscription,
            itemToMonitor,
            parameters,
            TimestampsToReturn.Both
        );

        monitoredItem.on("changed", (dataValue: DataValue) => {
            console.log("changed");
            console.log(dataValue.value);

            const newState = (currentStateInfo.values.find(value => value.assuredValue == dataValue.value.value)).stateTypeIri;

            // Send a post to the skill state change route to update the state and trigger all functions (e.g. websocket communication)
            this.skillStateService.updateState(skillIri, newState);
        });
        console.log("item to monitor set up");

        return monitoredItem;
    }
}
