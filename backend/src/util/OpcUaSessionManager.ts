import { ClientSession, ConnectionStrategy, MessageSecurityMode, OPCUAClient,
    OPCUAClientOptions, SecurityPolicy, UserIdentityInfo, UserTokenType } from "node-opcua";
import { Injectable } from "@nestjs/common";
import { GraphDbConnectionService } from "./GraphDbConnection.service";
import { SparqlResultConverter } from "sparql-result-converter";
import { opcUaSkillParameterMapping } from "../routes/skill-execution/executors/skill-execution-mappings";

@Injectable()
export class OpcUaSessionManager {

    private converter = new SparqlResultConverter();
    private sessions = new Map<string, Promise<ClientSession>>();
    private connectionStrategy: ConnectionStrategy = {
        initialDelay: 1000,
        maxRetry: 1,
        maxDelay: 10000,
        randomisationFactor: 0.5
    };

    constructor(
        private graphDbConnection: GraphDbConnectionService
    ){}

    public getSession(skillIri: string): Promise<ClientSession> {
        let session = this.sessions.get(skillIri);

        if(!session) {
            session = this.createSession(skillIri);
            this.sessions.set(skillIri, session);
        }

        return session;
    }


    private async createSession(skillIri: string): Promise<ClientSession> {
        const uaServerInfo = await this.getOpcUaServerInfo(skillIri);
        const options = this.createOptionsObject(uaServerInfo.messageSecurityMode, uaServerInfo.securityPolicy);
        const uaClient = OPCUAClient.create(options);

        try {
            await uaClient.connect(uaServerInfo.endpointUrl);
        } catch (err) {
            console.log(`Error while connecting to UAServer at ${uaServerInfo.endpointUrl}. Err: ${err}`);
        }

        const userInfo = this.createUserIdentityToken(uaServerInfo.username, uaServerInfo.password);
        const uaSession = await uaClient.createSession(userInfo);             // TODO: Integrate user identity token here
        return uaSession;
    }


    /**
     * Get all info about an OPC UA server that is necessary to connect and create a session
     * @param skillIri IRI of the skill that the server contains
     */
    private async getOpcUaServerInfo(skillIri: string): Promise<OpcUaServerInfo> {
        const query = `
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        SELECT ?endpointUrl ?messageSecurityMode ?securityPolicy ?username ?password WHERE {
            BIND(<${skillIri}> AS ?skillIri).
            ?skillIri CSS:accessibleThrough ?skillInterface.
            ?uaServer OpcUa:hasNodeSet/OpcUa:containsNode ?skillInterface;
                OpcUa:hasEndpointUrl ?endpointUrl;
                OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                OpcUa:hasSecurityPolicy ?securityPolicy.
            OPTIONAL {
                ?uaServer OpcUa:requiresUserName ?username;
                    OpcUa:requiresPassword ?password.
            }
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const opcUaServerInfo = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaSkillParameterMapping)
            .getFirstRootElement()[0] as Promise<OpcUaServerInfo>;

        return opcUaServerInfo;
    }

    createOptionsObject(messageSecurityModeIri: string, securityPolicyIri: string): OPCUAClientOptions {
        const options : OPCUAClientOptions = {
            applicationName: "SkillMEx OPC UA Capability Executor",
            connectionStrategy: this.connectionStrategy,
            securityMode: this.getMessageSecurityMode(messageSecurityModeIri),
            securityPolicy: this.getSecurityPolicy(securityPolicyIri),
            endpointMustExist: false,
        };

        return options;
    }

    /**
     * Returns a proper node-opc-ua MessageSecurityMode from a given IRI
     * @param messageSecurityModeIri IRI of a MessageSecurityMode according to the OPC UA ontology
     */
    protected getMessageSecurityMode(messageSecurityModeIri: string): MessageSecurityMode {
        switch (messageSecurityModeIri) {
        case "http://www.hsu-ifa.de/ontologies/OpcUaMessageSecurityMode_None":
            return MessageSecurityMode.None;
        case "http://www.hsu-ifa.de/ontologies/OpcUaMessageSecurityMode_Sign":
            return MessageSecurityMode.Sign;
        case "http://www.hsu-ifa.de/ontologies/OpcUaMessageSecurityMode_SignAndEncrypt":
            return MessageSecurityMode.SignAndEncrypt;
        default:
            return MessageSecurityMode.None;
        }
    }

    protected getSecurityPolicy(securityPolicyString: string): SecurityPolicy {
        switch (securityPolicyString) {
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_Aes128_Sha256_RsaOaep":
            return SecurityPolicy.Aes128_Sha256_RsaOaep;
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_Basic128":
            return SecurityPolicy.Basic128;
        case "OpcUa:SecurityPolicy_Basic128":
            return SecurityPolicy.Basic128Rsa15;
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_Basic192":
            return SecurityPolicy.Basic192;
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_Basic192Rsa15":
            return SecurityPolicy.Basic192Rsa15;
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_Basic256":
            return SecurityPolicy.Basic256;
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_Basic256Rsa15":
            return SecurityPolicy.Basic256Rsa15;
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_Basic256Sha256":
            return SecurityPolicy.Basic256Sha256;
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_None":
            return SecurityPolicy.None;
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_PubSub_Aes128_CTR":
            return SecurityPolicy.PubSub_Aes128_CTR;
        case "http://www.hsu-ifa.de/ontologies/OpcUa#SecurityPolicy_PubSub_Aes256_CTR":
            return SecurityPolicy.PubSub_Aes256_CTR;
        default:
            return SecurityPolicy.None;
        }
    }

    protected createUserIdentityToken(user: string, password: string): UserIdentityInfo {
        // if a user and password are set -> create a token
        if(user && password) {
            const info: UserIdentityInfo = {
                userName: user,
                password: password,
                type: UserTokenType.UserName
            };
            return info;
        } else {
            const info: UserIdentityInfo = {
                type: UserTokenType.Anonymous
            };
            return info;
        }
    }

    protected async endUaConnection(skillIri: string): Promise<void> {
        const uaSession = await this.sessions.get(skillIri);
        uaSession.close().then(() => this.sessions.delete(skillIri));

        // TODO: How to handle disconnect
        // this.uaClient.disconnect();
    }


}


interface OpcUaServerInfo{
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    username: string;
    password: string;
}
