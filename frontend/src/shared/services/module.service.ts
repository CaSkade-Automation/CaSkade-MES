import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, merge } from "rxjs";
import { map, startWith, take, tap} from 'rxjs/operators';
import { ProductionModuleDto } from "@shared/models/production-module/ProductionModule";
import { ModuleSocketService } from "./sockets/module-socket.service";
import { ProductionModule } from "../models/ProductionModule";
import { CapabilitySocketService } from "./sockets/capability-socket.service";
import { SkillSocketService } from "./sockets/skill-socket.service";

@Injectable({
    providedIn: 'root'
})
export class ModuleService {
    apiRoot = "/api";

    private moduleSubject$ = new BehaviorSubject<ProductionModule[]>([]);


    onModuleAdded$ = this.moduleSocket.onModulesAdded()
    onModuleDeleted$ = this.moduleSocket.onModuleDeleted()

    onCapabilityAdded$ = this.capabilitySocket.onCapabilitiesAdded();
    onCapabilityDeleted$ = this.capabilitySocket.onCapabilityDeleted();
    onSkillAdded$ = this.skillSocket.onSkillsAdded();
    onSkillDeleted$ = this.skillSocket.onSkillDeleted();
    onCapabilityOrSkillChanged$ = merge(this.onCapabilityAdded$, this.onCapabilityDeleted$, this.onSkillAdded$, this.onSkillDeleted$)

    constructor(
        private http: HttpClient,
        private moduleSocket: ModuleSocketService,
        private capabilitySocket: CapabilitySocketService,
        private skillSocket: SkillSocketService) {
        this.loadModulesAndSubscribe();
    }

    public loadModulesAndSubscribe(): void {
        this.loadModules().subscribe(modules => {
            const initialModules = modules;
            // on adding, we get the current modules, so update
            this.onModuleAdded$.pipe(startWith(initialModules)).subscribe(addedModules => {
                const allModules = [...this.moduleSubject$.value, ...addedModules];
                this.moduleSubject$.next(allModules);
            });
        });

        // on delete, we get the current modules, so update
        this.onModuleDeleted$.subscribe(modules => {
            this.moduleSubject$.next(modules);
        });

        // on changes (add, delete) of capabilities and skills it's best to reload all modules
        this.onCapabilityOrSkillChanged$.subscribe(changes => {
            this.loadModules().subscribe(modules => {
                this.moduleSubject$.next(modules);
            });
        });
    }

    public getModules(): Observable<ProductionModule[]> {
        return this.moduleSubject$.asObservable();
    }

    public reloadModules(): void {
        this.loadModules().subscribe(modules => this.moduleSubject$.next(modules));
    }

    /**
     * Loads all modules from GraphDB with an HTTP Rest
     */
    private loadModules(): Observable<ProductionModule[]> {
        const apiURL = `${this.apiRoot}/modules`;
        return this.http.get<ProductionModuleDto[]>(apiURL).pipe(
            take(1),
            map((moduleDtos: ProductionModuleDto[]) => moduleDtos.map(dto => new ProductionModule(dto))),
        );
    }


    /**
     * Deletes a module
     * @param moduleIri IRI of the module to delete
     * @returns A void observable as DELETE returns empty body
     */
    deleteModule(moduleIri: string): Observable<void> {
        const encodedModuleIri = encodeURIComponent(moduleIri);
        const url = `api/modules/${encodedModuleIri}`;
        return this.http.delete<void>(url);
    }


    /**
     * Get a single module by its IRI
     * @param moduleIri IRI of the module to return
     */
    getModuleByIri(moduleIri: string): Observable<ProductionModule> {
        const encodedModuleIri = encodeURIComponent(moduleIri);
        const apiURL = `${this.apiRoot}/modules/${encodedModuleIri}`;
        return this.http.get<ProductionModuleDto>(apiURL).pipe(
            map((data: ProductionModuleDto) => new ProductionModule(data))
        );
    }

    addModule(ontologyString: string): void {
        const apiURL = `${this.apiRoot}/modules`;
        const headers = new HttpHeaders({"content-type": "text/turtle"});
        this.http.post<ProductionModuleDto>(apiURL, ontologyString, {headers: headers})
            .subscribe({
                next: (res) => this.moduleSubject$.next([...this.moduleSubject$.value, new ProductionModule(res)]),
                error: (err) => {throw err;}
            });
    }

    addMtpModule(ontologyFile: File): Observable<File>{
        const apiURL = `${this.apiRoot}/Mtp`;
        const formData= new FormData;
        formData.append('file', ontologyFile, ontologyFile.name);
        return this.http.post<File>(apiURL, formData);
    }
}
