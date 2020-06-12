import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";
import { ProductionModule } from "../../../../shared/models/production-module/ProductionModule";
import { map, flatMap, toArray, tap } from 'rxjs/operators';
import { Module } from "../models/module";
import { CapabilityService } from "./capability.service";
import { FpbElement } from "../../../../shared/models/fpb/FpbElement";
import { Skill } from "../../../../shared/models/skill/Skill";
import { Capability } from "../../../../shared/models/capability/Capability";
import { StateMachine } from "../../../../shared/models/state-machine/StateMachine";
import { State } from "../../../../shared/models/state-machine/State";
import { Transition } from "../../../../shared/models/state-machine/Transition";

@Injectable({
    providedIn: 'root'
})
export class ModuleService {
    apiRoot = "/api";

    constructor(
        private http: HttpClient,
        private capabilityService: CapabilityService) { }


    // Returns fake data for Tom
    // TODO: Return real data
    getAllModulesWithCapabilitiesAndSkills(): ProductionModule[] {
        const dummyState = new State("www.asd.de#dummyState");
        const dummyTransition = new Transition("www.asd.de#dummyTransition");

        const fakeModules: ProductionModule[] = [
            new ProductionModule("www.asd.de#Bohrmodul",
                [new Capability("www.asd.de#Bohren",
                    [new FpbElement("www.asd.de#Rohteil"), new FpbElement("www.asd.de#Bohrungsinfos"), new FpbElement("www.asd.de#Information")],
                    [new FpbElement("www.asd.de#Fertigteil")],
                    [new Skill("www.asd.de#Bohren_RestSkill", new StateMachine("www.asd.de#BohrenRestSkill_StateMachine", [dummyState], [dummyTransition]), dummyState ),  new Skill("www.asd.de#Bohren_OpcUaSkill", new StateMachine("www.asd.de#BohrenOpcUaSkill_StateMachine", [dummyState], [dummyTransition]), dummyState )]
                )]),
            new ProductionModule("www.asd.de#Fräsmodul",
                [new Capability("www.asd.de#Fräsen",
                    [ new FpbElement("www.asd.de#Rohteil"), new FpbElement("www.asd.de#Fräsinfos"), new FpbElement("www.asd.de#Information")],
                    [ new FpbElement("www.asd.de#Fertigteil")],
                    [ new Skill("www.asd.de#Fräsen_RestSkill", new StateMachine("www.asd.de#FräsenRestSkill_StateMachine", [dummyState], [dummyTransition]), dummyState ),  new Skill("www.asd.de#Fräsen_OpcUaSkill", new StateMachine("www.asd.de#FräsenRestSkill_StateMachine", [dummyState], [dummyTransition]), dummyState )]
                )]),
        ];

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
    }


    getAllModules(): Observable<ProductionModule[]> {
        const apiURL = `${this.apiRoot}/modules`;
        return this.http.get<ProductionModule[]>(apiURL).pipe(
            map(
                (data: ProductionModule[]) => data.map(productionModule => {
                    return new ProductionModule(productionModule.iri, productionModule.capabilities);
                })
            ));
    }

    getAllModulesComplete(): Observable<ProductionModule[]> {
        const apiURL = `${this.apiRoot}/modules`;
        return this.http.get<ProductionModule[]>(apiURL).pipe(
            map(
                (data: ProductionModule[]) => data.map(productionModule => {
                    return new ProductionModule(productionModule.iri);
                })
            ));
    }


}
