import { RdfElement } from "../RdfElement";

export class Command extends RdfElement {

        shortName: string;

        constructor(iri:string){
            super(iri);
            this.getShortName();
        }

        private getShortName() {
            const localName = this.getLocalName();
            const lastUnderscorePosition = localName.lastIndexOf("Command");
            this.shortName = localName.slice(0,lastUnderscorePosition);
        }
}
