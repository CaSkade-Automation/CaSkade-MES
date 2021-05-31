export class ProcessInstanceDto {
        links: Array<string>;
        id: string;
        definitionId: string;
        businessKey: string;
        caseInstanceId: string;
        ended: boolean;
        suspended: boolean;
        tenantId: string;
       
        constructor( links: Array<string>,
            id: string,
            definitionId: string,
            businessKey: string,
            caseInstanceId: string,
            ended: boolean,
            suspended: boolean,
            tenantId: string){
           this.links=links;
           this.id=id;
           this.definitionId=definitionId;
           this.businessKey=businessKey;
           this.caseInstanceId=caseInstanceId;
           this.ended=ended;
           this.suspended=suspended;
           this.tenantId=tenantId;
        }
}
export class ProcessInstance {
        links: Array<string>;
        id: string;
        definitionId: string;
        businessKey: string;
        caseInstanceId: string;
        ended: boolean;
        suspended: boolean;
        tenantId: string;
       
        constructor( links: Array<string>,
            id: string,
            definitionId: string,
            businessKey: string,
            caseInstanceId: string,
            ended: boolean,
            suspended: boolean,
            tenantId: string){
           this.links=links;
           this.id=id;
           this.definitionId=definitionId;
           this.businessKey=businessKey;
           this.caseInstanceId=caseInstanceId;
           this.ended=ended;
           this.suspended=suspended;
           this.tenantId=tenantId;
        }
}