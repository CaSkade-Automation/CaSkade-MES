export class ChangeCapabilityTypeDto {

    constructor(
        public newType: CapabilityType,
        public providingResourceIri?: string
    ) {}

}

export enum CapabilityType {
    "All" = "http://www.w3id.org/hsu-aut/css#Capability",
    "ProvidedCapability" = "http://www.w3id.org/hsu-aut/cask#ProvidedCapability",
    "RequiredCapability" = "http://www.w3id.org/hsu-aut/cask#RequiredCapability",
    "None" = "http://www.w3id.org/hsu-aut/cask#NullCapability"
}
