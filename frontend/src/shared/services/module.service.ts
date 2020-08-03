import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, Observer } from "rxjs";
import { ProductionModule, ProductionModuleDto } from "../../../../shared/models/production-module/ProductionModule";
import { map, flatMap, toArray, tap, take } from 'rxjs/operators';
import { Module } from "../models/module";
import { CapabilityService } from "./capability.service";
import { FpbElement } from "../../../../shared/models/fpb/FpbElement";
import { Skill } from "../../../../shared/models/skill/Skill";
import { Capability } from "../../../../shared/models/capability/Capability";
import { StateMachine } from "../../../../shared/models/state-machine/StateMachine";
import { State } from "../../../../shared/models/state-machine/State";
import { Transition } from "../../../../shared/models/state-machine/Transition";
import { SocketService } from "./socket.service";
import { SocketEventName } from "@shared/socket-communication/SocketEventName";

@Injectable({
    providedIn: 'root'
})
export class ModuleService {
    apiRoot = "/api";

    observer: Observer<ProductionModule[]>;

    constructor(
        private http: HttpClient,
        private capabilityService: CapabilityService,
        private socketService: SocketService) { }


    // Returns fake data for Tom
    // TODO: Return real data
    // getAllModulesWithCapabilitiesAndSkills(): ProductionModule[] {
    //     const dummyState = new State("www.asd.de#dummyState");
    //     const dummyTransition = new Transition("www.asd.de#dummyTransition");

    //     const fakeModules: ProductionModule[] = [
    //         new ProductionModule("www.asd.de#Bohrmodul",
    //             [new Capability("www.asd.de#Bohren",
    //                 [new FpbElement("www.asd.de#Rohteil"), new FpbElement("www.asd.de#Bohrungsinfos"), new FpbElement("www.asd.de#Information")],
    //                 [new FpbElement("www.asd.de#Fertigteil")],
    //                 [new Skill("www.asd.de#Bohren_RestSkill", new StateMachine("www.asd.de#BohrenRestSkill_StateMachine", [dummyState], [dummyTransition]), dummyState ),  new Skill("www.asd.de#Bohren_OpcUaSkill", new StateMachine("www.asd.de#BohrenOpcUaSkill_StateMachine", [dummyState], [dummyTransition]), dummyState )]
    //             )]),
    //         new ProductionModule("www.asd.de#Fräsmodul",
    //             [new Capability("www.asd.de#Fräsen",
    //                 [ new FpbElement("www.asd.de#Rohteil"), new FpbElement("www.asd.de#Fräsinfos"), new FpbElement("www.asd.de#Information")],
    //                 [ new FpbElement("www.asd.de#Fertigteil")],
    //                 [ new Skill("www.asd.de#Fräsen_RestSkill", new StateMachine("www.asd.de#FräsenRestSkill_StateMachine", [dummyState], [dummyTransition]), dummyState ),  new Skill("www.asd.de#Fräsen_OpcUaSkill", new StateMachine("www.asd.de#FräsenRestSkill_StateMachine", [dummyState], [dummyTransition]), dummyState )]
    //             )]),
    //     ];

    //     return fakeModules;
    // }


    /**
     * Get all modules currently registered
     */
    getAllModules(): Observable<ProductionModule[]> {
        let modules;
        this.loadModules().pipe(take(1)).subscribe(initialModules => {
            modules = initialModules;
            this.observer.next(modules);
        });

        this.socketService.getMessage(SocketEventName.ProductionModules_Added).subscribe(msg => {
            this.loadModules().pipe(take(1)).subscribe((newModules: any) => {
                // if(modules) {
                //     this.addNewModules(modules, newModules);
                // }
                this.observer.next(newModules);
            });
        });
        return this.createObservable();
    }

    // addNewModules(oldModules: ProductionModule[], newModules: ProductionModule[]): ProductionModule[] {
    //     newModules.forEach(module => {
    //         if (!oldModules.some(currentModule => currentModule.iri == module.iri)) {
    //             this.modules.push(module);
    //         }
    //     });
    // }

    /**
     * Loads all modules from GraphDB with an HTTP Rest
     */
    private loadModules(): Observable<ProductionModule[]> {
        const apiURL = `${this.apiRoot}/modules`;
        return this.http.get<ProductionModuleDto[]>(apiURL).pipe(
            map(
                (data: ProductionModuleDto[]) => data.map(productionModuleDto => {
                    return new ProductionModule(productionModuleDto);
                })
            ));
    }



    createObservable(): Observable<ProductionModule[]> {
        return new Observable(observer => {
            this.observer = observer;
        });
    }

    /**
     * Get a single module by its IRI
     * @param moduleIri IRI of the module to return
     */
    getModuleByIri(moduleIri: string): Observable<ProductionModule> {
        const encodedModuleIri = encodeURI(moduleIri);
        const apiURL = `${this.apiRoot}/modules/${encodedModuleIri}`;
        return this.http.get<ProductionModuleDto>(apiURL).pipe(
            map((data: ProductionModuleDto) => new ProductionModule(data))
        );
    }
    addModule(ontologyString: string): Observable<Record<string, any>> {
        const apiURL = `${this.apiRoot}/modules`;
        return this.http.post<ProductionModuleDto>(apiURL, ontologyString);
    }

}
