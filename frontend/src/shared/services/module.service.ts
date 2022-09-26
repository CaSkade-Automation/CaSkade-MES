import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable,  Observer } from "rxjs";
import { ProductionModuleDto } from "@shared/models/production-module/ProductionModule";
import { map,  take } from 'rxjs/operators';
import { ModuleSocketService } from "./sockets/module-socket.service";
import { ProductionModule } from "../models/ProductionModule";

@Injectable({
    providedIn: 'root'
})
export class    ModuleService {
    apiRoot = "/api";

    observer: Observer<ProductionModule[]>;

    constructor(
        private http: HttpClient,
        private moduleSocket: ModuleSocketService) { }

    /**
     * Get all modules currently registered
     */
    getAllModules(): Observable<ProductionModule[]> {
        let modules;
        this.loadModules().pipe(take(1)).subscribe(initialModules => {
            modules = initialModules;
            this.observer.next(modules);
        });

        this.moduleSocket.getModulesAdded().subscribe(msg => {
            this.loadModules().pipe(take(1)).subscribe((newModules: any) => {
                // if(modules) {
                //     this.addNewModules(modules, newModules);
                // }
                this.observer.next(newModules);
            });
        });
        return this.createObservable();
    }

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
        const encodedModuleIri = encodeURIComponent(moduleIri);
        const apiURL = `${this.apiRoot}/modules/${encodedModuleIri}`;
        return this.http.get<ProductionModuleDto>(apiURL).pipe(
            map((data: ProductionModuleDto) => new ProductionModule(data))
        );
    }
    addModule(ontologyString: string): Observable<Record<string, any>> {
        const apiURL = `${this.apiRoot}/modules`;
        const headers = new HttpHeaders({"content-type": "text/turtle"});
        return this.http.post<ProductionModuleDto>(apiURL, ontologyString, {headers: headers});
    }

    addMtpModule(ontologyFile: File): Observable<File>{
        const apiURL = `${this.apiRoot}/Mtp`;
        const formData= new FormData;
        formData.append('file', ontologyFile, ontologyFile.name);
        return this.http.post<File>(apiURL, formData);
    }
}
