import { AttributeIds, ClientMonitoredItem, ClientSession, ClientSubscription, DataValue, MonitoringParametersOptions, ReadValueIdLike, TimestampsToReturn } from "node-opcua";

export class OpcUaStateChangeMonitor {

    subscription: ClientSubscription;

    constructor(session: ClientSession, nodeIdToMonitor: string) {
        this.subscription = ClientSubscription.create(session, {
            requestedPublishingInterval: 1000,
            requestedLifetimeCount: 100,
            requestedMaxKeepAliveCount: 10,
            maxNotificationsPerPublish: 100,
            publishingEnabled: true,
            priority: 10
        });

        this.subscription.on("started", this.onStarted);
        this.subscription.on("keepalive", this.onKeepAlive);
        this.subscription.on("terminated", this.onTerminated);

        // install monitored item
        const itemToMonitor: ReadValueIdLike = {
            nodeId: nodeIdToMonitor,
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
            console.log(" value has changed : ", dataValue.value.toString());
        });
    }






    onStarted() {
        console.log(`subscription started for 2 seconds - subscriptionId= ${this.subscription.subscriptionId}`);
    }

    onKeepAlive() {
        console.log("keepalive");
    }

    onTerminated() {
        console.log("terminated");
    }

}
