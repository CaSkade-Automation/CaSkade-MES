export class ProcessInstanceDto {
        constructor(
            public links: Array<string>,
            public id: string,
            public definitionId: string,
            public businessKey: string,
            public caseInstanceId: string,
            public ended: boolean,
            public suspended: boolean,
            public tenantId: string) {}
}

export class ProcessInstance {
    links: Array<string>;
    id: string;
    definitionId: string;
    businessKey: string;
    caseInstanceId: string;
    state: ProcessInstanceState;
    tenantId: string;
    private suspended: boolean;
    private ended: boolean;

    constructor(dto: ProcessInstanceDto) {
        this.links = dto.links;
        this.id = dto.id;
        this.definitionId = dto.definitionId;
        this.businessKey = dto.businessKey;
        this.caseInstanceId = dto.caseInstanceId;
        this.tenantId = dto.tenantId;
        this.suspended = dto.suspended;
        this.ended = dto.ended;

        if(!dto.suspended && !dto.ended) {
            this.state = ProcessInstanceState.active;
        }
        if(dto.suspended) this.state = ProcessInstanceState.suspended
        if(dto.ended) this.state = ProcessInstanceState.ended;
    }

    getStateBadge(): string {
        if (this.state === ProcessInstanceState.active) return `<span class="badge rounded-pill bg-success">${this.state}</span>`;
        if (this.state === ProcessInstanceState.suspended) return`<span class="badge rounded-pill bg-warning text-dark">${this.state}</span>`;
        if (this.state === ProcessInstanceState.ended) return`<span class="badge rounded-pill bg-dark">${this.state}</span>`;
    }

    toInstanceDto(): ProcessInstanceDto {
        return {...this, suspended: this.suspended, ended: this.ended};
    }
}

enum ProcessInstanceState {
    active = "active",
    suspended = "suspended",
    ended = "ended"
}
