export class RdfElement {
  constructor(public iri: string) {}

  getLocalName(): string {
    const localName = this.iri.split('#')[1];
    return localName;
  }

  getNamespace(): string {
      const namespace = this.iri.split('#')[0];
      return namespace;
  }
}
