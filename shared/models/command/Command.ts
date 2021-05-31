export class Command {
    
        name: string;
        iri: string;
        active: boolean;
        group: number;
        
        constructor(name:string,iri:string, active:boolean, group:number){
            this.name=name;
            this.iri=iri;
            this.active=active;
            this.group=group;
        }
}
