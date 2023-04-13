import { HttpModuleOptions, HttpModuleOptionsFactory } from "@nestjs/axios";
import { Global } from "@nestjs/common";

/**
 * A global config service to setup Nest HttpModule. Note:
 */
@Global()
export class LocalHttpRequestConfigService implements HttpModuleOptionsFactory {
    createHttpOptions(): HttpModuleOptions {
        return {
            baseURL: 'http://localhost:9090/api'
        };
    }
}
