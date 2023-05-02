export class PlcMappingRequest {

    constructor(
        public file: File,
        public endpointUrl = "",
        public baseIri = "",
        public resourceIri = "",
        public user = "",
        public password = "",
        public nodeIdRoot ="") {}

}
