import { ClientSession, ConnectionStrategy, MessageSecurityMode, OPCUAClient,
    OPCUAClientOptions, SecurityPolicy, UserIdentityInfo, UserNameIdentityToken, UserTokenType } from "node-opcua";
import { Injectable } from "@nestjs/common";
import { GraphDbConnectionService } from "./GraphDbConnection.service";
import { SparqlResultConverter } from "sparql-result-converter";
import { opcUaServerInfoMapping, opcUaSkillParameterMapping } from "../routes/skill-execution/executors/skill-execution-mappings";

@Injectable()
export class OpcUaSessionManager {

    private converter = new SparqlResultConverter();
    private sessions = new Map<string, Promise<ClientSession>>();
    private connectionStrategy: ConnectionStrategy = {
        initialDelay: 1000,
        maxRetry: 2,
        maxDelay: 10000,
        randomisationFactor: 0.5,
    };

    constructor(
        private graphDbConnection: GraphDbConnectionService
    ){
        this.setupGarbageCollector();
    }

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
        const endpoint = this.findSuitableEndpoint(uaServerInfo);
        const options = this.createOptionsObject(endpoint.messageSecurityMode, endpoint.securityPolicy);
        const uaClient = OPCUAClient.create(options);

        try {
            await uaClient.connect(endpoint.endpointUrl);
        } catch (err) {
            console.log(`Error while connecting to endpoint of UAServer at ${endpoint.endpointUrl}. Err: ${err}`);
        }

        const userInfo = this.findUserIdentityInfo(endpoint);
        const uaSession = await uaClient.createSession(userInfo);
        return uaSession;
    }

    private findSuitableEndpoint(uaServerInfo: OpcUaServerInfo): EndpointDescription {
        return uaServerInfo.endpoints.find(endpoint => {
            const messageSecurityMode = this.getMessageSecurityMode(endpoint.messageSecurityMode);
            const securityPolicy = this.getSecurityPolicy(endpoint.securityPolicy);
            return (messageSecurityMode == MessageSecurityMode.None && securityPolicy == SecurityPolicy.None);
        });
    }


    /**
     * Get all info about an OPC UA server that is necessary to connect and create a session
     * @param skillIri IRI of the skill that the server contains
     */
    private async getOpcUaServerInfo(skillIri: string): Promise<OpcUaServerInfo> {
        const query = `
        PREFIX CSS: <http://www.w3id.org/hsu-aut/css#>
        PREFIX OpcUa: <http://www.w3id.org/hsu-aut/OpcUa#>
        SELECT ?serverIri ?endpoint ?endpointUrl ?messageSecurityMode ?securityPolicy ?userIdentityToken ?tokenType
            ?userName ?password WHERE {
            BIND(<${skillIri}> AS ?skillIri).
            ?skillIri CSS:accessibleThrough ?skillInterface.
            ?serverIri OpcUa:hasNodeSet/OpcUa:containsNode ?skillInterface;
                OpcUa:hasEndpointDescription ?endpoint.
            ?endpoint OpcUa:hasEndpointUrl ?endpointUrl;
                OpcUa:hasMessageSecurityMode ?messageSecurityMode;
                OpcUa:hasSecurityPolicy ?securityPolicy;
                OpcUa:hasUserIdentityToken ?userIdentityToken.
            ?userIdentityToken a ?tokenType.
            ?tokenType rdfs:subClassOf OpcUa:UserIdentityToken.
            OPTIONAL {
                ?userIdentityToken OpcUa:requiresUserName ?userName;
                    OpcUa:requiresPassword ?password.
            }
        }`;
        const queryResult = await this.graphDbConnection.executeQuery(query);
        const opcUaServerInfo = <unknown>this.converter.convertToDefinition(queryResult.results.bindings, opcUaServerInfoMapping)
            .getFirstRootElement()[0] as Promise<OpcUaServerInfo>;

        return opcUaServerInfo;
    }

    private createOptionsObject(messageSecurityModeIri: string, securityPolicyIri: string): OPCUAClientOptions {
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
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_Aes128_Sha256_RsaOaep":
            return SecurityPolicy.Aes128_Sha256_RsaOaep;
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_Basic128":
            return SecurityPolicy.Basic128;
        case "OpcUa:SecurityPolicy_Basic128":
            return SecurityPolicy.Basic128Rsa15;
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_Basic192":
            return SecurityPolicy.Basic192;
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_Basic192Rsa15":
            return SecurityPolicy.Basic192Rsa15;
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_Basic256":
            return SecurityPolicy.Basic256;
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_Basic256Rsa15":
            return SecurityPolicy.Basic256Rsa15;
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_Basic256Sha256":
            return SecurityPolicy.Basic256Sha256;
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_None":
            return SecurityPolicy.None;
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_PubSub_Aes128_CTR":
            return SecurityPolicy.PubSub_Aes128_CTR;
        case "http://www.w3id.org/hsu-aut/OpcUa#SecurityPolicy_PubSub_Aes256_CTR":
            return SecurityPolicy.PubSub_Aes256_CTR;
        default:
            return SecurityPolicy.None;
        }
    }

    protected findUserIdentityInfo(endpoint: EndpointDescription): UserIdentityInfo {
        // see if there is a userName token -> use it
        let token = endpoint.userIdentityTokens.find(token => token.tokenType == "http://www.w3id.org/hsu-aut/OpcUa#UserNameIdentityToken");
        if (token) {
            const info: UserIdentityInfo = {
                userName: token.userName,
                password: token.password,
                type: UserTokenType.UserName
            };
            return info;
        }

        // if not, take an anonymous one
        token = endpoint.userIdentityTokens.find(token => token.tokenType == "http://www.w3id.org/hsu-aut/OpcUa#AnonymousIdentityToken");
        if(token) {
            const info: UserIdentityInfo = {
                type: UserTokenType.Anonymous
            };
            return info;
        }

        throw new Error("Cannot find endpoint with supported user identity info.");     // if no anonymous either, throw an error
        // TODO: Implement other types of user tokens
    }

    /**
     * Very simple session invalidation, just delete everything after 10 seconds
     */
    private setupGarbageCollector(): void {
        setInterval(() => this.sessions.clear(), 10000);
    }

    private async endUaConnection(skillIri: string): Promise<void> {
        const uaSession = await this.sessions.get(skillIri);
        uaSession.close().then(() => this.sessions.delete(skillIri));

        // TODO: How to handle disconnect
        // this.uaClient.disconnect();
    }


}


class OpcUaServerInfo {
    serverIri: string;
    endpoints = new Array<EndpointDescription>();
}

class EndpointDescription {
    endpointUrl: string;
    messageSecurityMode: string;
    securityPolicy: string;
    userIdentityTokens = new Array<UserIdentityToken>();
}

class UserIdentityToken {
    tokenType: OpcUaOntologyTokenType
    userName?: string;
    password?: string;
}

type OpcUaOntologyTokenType =
    "http://www.w3id.org/hsu-aut/OpcUa#AnonymousIdentityToken" |
    "http://www.w3id.org/hsu-aut/OpcUa#IssuedIdentityToken" |
    "http://www.w3id.org/hsu-aut/OpcUa#UserNameIdentityToken" |
    "http://www.w3id.org/hsu-aut/OpcUa#X509IdentityToken";
