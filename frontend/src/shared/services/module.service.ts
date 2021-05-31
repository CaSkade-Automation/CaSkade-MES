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
import { stringify } from "@angular/compiler/src/util";

@Injectable({
    providedIn: 'root'
})
export class    ModuleService {
    apiRoot = "/api";

    observer: Observer<ProductionModule[]>;

    constructor(
        private http: HttpClient,
        private capabilityService: CapabilityService,
        private socketService: SocketService) { }

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
    // addMtpModule(ontologyFile: File): Observable<File>{
    //     const apiURL= `${this.apiRoot}/MtpModules`;
    //     console.log("Module posted (mtp)");
    //     return this.http.post<File>(apiURL, ontologyFile);
    //     const  testString="testtesttest";
    //     //return this.http.post<string>(apiURL,testString);

    // }
    addMtpModule(ontologyFile: File): Observable<File>{
        const apiURL = `${this.apiRoot}/Mtp`;
        const formData= new FormData;
        formData.append('file', ontologyFile, ontologyFile.name);
        return this.http.post<File>(apiURL, formData);
    }
}
