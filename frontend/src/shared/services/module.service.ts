import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";
import { Process, ManufacturingModule } from "../models/self-description";
import { ProductionModule } from "../../../../shared/models/production-module/ProductionModule";
import { Skill } from "../../../../shared/models/skill/Skill";
import { map, flatMap, toArray, tap } from 'rxjs/operators';
import { Module } from "../models/module";
import { Capability } from "../../../../shared/models/capability/Capability";
import { CapabilityService } from "./capability.service";

@Injectable()
export class ModuleService {
    apiRoot = "/api";

    constructor(
        private http: HttpClient,
        private capabilityService: CapabilityService) { }


    // Returns fake data for Tom
    // TODO: Return real data
    getAllModulesWithCapabilitiesAndSkills(): Module[] {
        const fakeModules: Module[] = [{
            name: "Bohrmodul",
            capabilities: [{
                name: "Bohren",
                hasInput: [{ name: "Rohteil", stateType: "Product" }, { name: "Bohrungsinfos", stateType: "Information" }],
                hasOutput: [{ name: "Fertigteil", stateType: "Product" }],
                executableViaSkill: [{ name: "Bohren_RestSkill" }, { name: "Bohren_OpcUaSkill" }]
            }]
        },
        {
            name: "Fräsmodul",
            capabilities: [{
                name: "Fräsen",
                hasInput: [{ name: "Rohteil", stateType: "Product" }, { name: "Fräsbahn", stateType: "Information" }],
                hasOutput: [{ name: "Fertigteil", stateType: "Product" }, { name: "Viele Späne", stateType: "Product" }],
                executableViaSkill: [{ name: "Fräsen_RestSkill" }, { name: "Fräsen_OpcUaSkill" }]
            }]
        }];

        return fakeModules;
    }

    getAllModulesWithCapabilities(): Observable<ProductionModule[]> {

        return this.getAllModules().pipe(flatMap((modules: ProductionModule[]) => {
            const capabilities$ = modules.map(module => this.capabilityService.getAllCapabilitiesOfModule(module.iri));
            return forkJoin(capabilities$).pipe(map(capabilities=>
                capabilities.map((capability, i) => {
                    const module = modules[i];
                    console.log(module);
                    module.addCapabilities(capability);
                    return module;
                })
            ));
        }));

        //         modules.map(module => {
        //             this.getAllCapabilitiesOfModule(module.iri).pipe(
        //                 // map(capabilities => module.addCapabilities(capabilities)),
        //                 tap(capabilities => {
        //                     console.log(" capabilities in service");
        //                     console.log(capabilities)
        //                 })
        //             )
        //         })
        //         return modules}),
        //     toArray(),
        //     tap(data => {
        //         console.log("logging from service");
        //         console.log(data)
        //     }
        //     )
        // )
        //     });
        // })
        //     map((module:ProductionModule[]) => {
        // ))
    }


    getAllModules(): Observable<ProductionModule[]> {
        const apiURL = `${this.apiRoot}/modules`;
        return this.http.get<ProductionModule[]>(apiURL).pipe(
            map(
                (data: ProductionModule[]) => data.map(productionModule => {
                    return new ProductionModule(productionModule.iri);
                })
            ));
    }


}
