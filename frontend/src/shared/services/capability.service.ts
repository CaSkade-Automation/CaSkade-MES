import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, merge } from 'rxjs';
import { CapabilityDto } from '@shared/models/capability/Capability';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, startWith, take } from 'rxjs/operators';
import { SkillService } from './skill.service';
import { Capability } from '../models/Capability';
import { environment } from '../../../environments/environment';
import { CapabilitySocketService } from './sockets/capability-socket.service';
import { SkillSocketService } from './sockets/skill-socket.service';


export enum CapabilityTypes {
    "All" = "http://www.w3id.org/hsu-aut/css#Capability",
    "ProvidedCapability" = "http://www.w3id.org/hsu-aut/cask#ProvidedCapability",
    "RequiredCapability" = "http://www.w3id.org/hsu-aut/cask#RequiredCapability",
    "None" = "http://www.w3id.org/hsu-aut/cask#NullCapability"
}


@Injectable({
    providedIn: 'root'
})
export class CapabilityService {
    apiRoot = `${environment.settings.backendUrl}/api`;

    private capabilitySubject$ = new BehaviorSubject<Capability[]>([]);

    private onCapabilityAdded$ = this.capabilitySocket.onCapabilitiesAdded();
    private onCapabilityDeleted$ = this.capabilitySocket.onCapabilityDeleted();
    private onSkillAdded$ = this.skillSocket.onSkillsAdded();
    private onSkillDeleted$ = this.skillSocket.onSkillDeleted();
    private onSkillChanged$ = merge(this.onSkillAdded$, this.onSkillDeleted$)

    constructor(
        private http: HttpClient,
        private capabilitySocket: CapabilitySocketService,
        private skillSocket: SkillSocketService
    ) {
        this.loadCapabiltiesAndSubscribe();
    }


    public getCapabilities(): Observable<Capability[]> {
        return this.capabilitySubject$.asObservable();
    }

    public loadCapabiltiesAndSubscribe(capType = CapabilityTypes.All): void {
        this.loadCapabilities(capType).subscribe(capabilities => {
            const initialCapabilities = capabilities;
            // on adding, we get the current modules, so update
            this.onCapabilityAdded$.pipe(startWith(initialCapabilities)).subscribe(addedCapabilities => {
                const allCapabilities = [...this.capabilitySubject$.value, ...addedCapabilities];
                this.capabilitySubject$.next(allCapabilities);
            });
        });

        // on delete, we get the current modules, so update
        this.onCapabilityDeleted$.subscribe(allCapabilities => {
            this.capabilitySubject$.next(allCapabilities);
        });

        // on changes (add, delete) of capabilities and skills it's best to reload all modules
        this.onSkillChanged$.subscribe(changes => {
            this.loadCapabilities().subscribe(capabilities => {
                this.capabilitySubject$.next(capabilities);
            });
        });
    }

    reloadCapabilities(): void {
        this.loadCapabilities().subscribe(capabilities => {
            this.capabilitySubject$.next(capabilities);
        });
    }

    /**
     * Loads all capabilities from GraphDB with a single HTTP request
     */
    private loadCapabilities(capType = CapabilityTypes.All): Observable<Capability[]> {
        const apiURL = `${this.apiRoot}/capabilities`;
        const typeParam = new HttpParams().append("type", capType);
        return this.http.get<CapabilityDto[]>(apiURL, {params: typeParam}).pipe(
            take(1),
            map((moduleDtos: CapabilityDto[]) => moduleDtos.map(dto => new Capability(dto))),
        );
    }


    /**
     * Returns a capability with a given IRI
     * @param capabilityIri IRI of the capability to return
     */
    getCapabilityByIri(capabilityIri: string): Observable<Capability> {
        const encodedCapabilityIri = encodeURIComponent(capabilityIri);
        const apiURL = `${this.apiRoot}/capabilities/${encodedCapabilityIri}`;
        return this.http.get<CapabilityDto>(apiURL).pipe(
            map((data: CapabilityDto) => new Capability(data))
        );
    }


    /**
     * Returns all capabilities of a certain module
     * @param moduleIri IRI of the module to return capabilities of
     */
    getCapabilitiesOfModule(moduleIri: string): Observable<Capability[]> {
        const encodedModuleIri = encodeURIComponent(moduleIri);
        const apiURL = `${this.apiRoot}/modules/${encodedModuleIri}/capabilities`;
        return this.http.get<CapabilityDto[]>(apiURL).pipe(
            map((data: CapabilityDto[]) => data.map(capabilityDto => new Capability(capabilityDto))
            ));
    }

    addCapability(ontologyString: string): Observable<Record<string, any>> {
        const apiURL = `${this.apiRoot}/capabilities`;
        const headers = new HttpHeaders({"content-type": "text/turtle"});
        return this.http.post<CapabilityDto>(apiURL, ontologyString, {headers: headers});
    }

    addMtpCapability(ontologyFile: File): Observable<File>{
        const apiURL = `${this.apiRoot}/Mtp`;
        const formData= new FormData;
        formData.append('file', ontologyFile, ontologyFile.name);
        return this.http.post<File>(apiURL, formData);
    }

    deleteCapability(capabilityIri: string): Observable<void> {
        const encodedIri = encodeURIComponent(capabilityIri);
        const apiUrl = `${this.apiRoot}/capabilities/${encodedIri}`;
        return this.http.delete<void>(apiUrl);
    }
}
