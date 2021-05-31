export class ProcessDefinitionDto {
        id: string;
        key: string;
        category: string;
        description: string;
        name: string;
        version: number;
        resource: string;
        deploymentId: string;
        diagram: string;
        suspended: boolean;
        tenantId: string;
        versionTag: string;
        historyTimeToLive: number;
        startableInTasklist: boolean;
       
        constructor(  id: string,
                key: string,
                category: string,
                description: string,
                name: string,
                version: number,
                resource: string,
                deploymentId: string,
                diagram: string,
                suspended: boolean,
                tenantId: string,
                versionTag: string,
                historyTimeToLive: number,
                startableInTasklist: boolean ){
        
                        this.id=id;
                        this.key=key;
                        this.category=category
                        this.description=description
                        this.name=name
                        this.version=version
                        this.resource=resource
                        this.deploymentId=deploymentId
                        this.diagram=diagram
                        this.suspended=suspended
                        this.tenantId=tenantId;
                        this.versionTag=versionTag;
                        this.historyTimeToLive=historyTimeToLive;
                        this.startableInTasklist=startableInTasklist;
        }
}
export class ProcessDefinition {
        id: string;
        key: string;
        category: string;
        description: string;
        name: string;
        version: number;
        resource: string;
        deploymentId: string;
        diagram: string;
        suspended: boolean;
        tenantId: string;
        versionTag: string;
        historyTimeToLive: number;
        startableInTasklist: boolean;
       
        constructor(  id: string,
                key: string,
                category: string,
                description: string,
                name: string,
                version: number,
                resource: string,
                deploymentId: string,
                diagram: string,
                suspended: boolean,
                tenantId: string,
                versionTag: string,
                historyTimeToLive: number,
                startableInTasklist: boolean ){
        
                        this.id=id;
                        this.key=key;
                        this.category=category
                        this.description=description
                        this.name=name
                        this.version=version
                        this.resource=resource
                        this.deploymentId=deploymentId
                        this.diagram=diagram
                        this.suspended=suspended
                        this.tenantId=tenantId;
                        this.versionTag=versionTag;
                        this.historyTimeToLive=historyTimeToLive;
                        this.startableInTasklist=startableInTasklist;
        }
}
