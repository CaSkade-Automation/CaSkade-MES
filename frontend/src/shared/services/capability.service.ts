import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { CapabilityDto } from '@shared/models/capability/Capability';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take, tap } from 'rxjs/operators';
import { SkillService } from './skill.service';
import { Capability } from '../models/Capability';
import { environment } from '../../../environments/environment';
import { CapabilitySocketService } from './sockets/capability-socket.service';

@Injectable({
    providedIn: 'root'
})
export class CapabilityService {
    apiRoot = `${environment.settings.backendUrl}/api`;

    observer: Observer<Capability[]>;

    constructor(
        private http: HttpClient,
        private skillService: SkillService,
        private capabilitySocket: CapabilitySocketService
    ) { }


    /**
     * Returns all capabilities that are currently registered
     */
    getAllCapabilities(): Observable<Capability[]> {
        let capabilities;
        this.loadCapabilities().pipe(take(1)).subscribe(initialCapabilities => {
            capabilities = initialCapabilities;
            this.observer.next(capabilities);
        });

        this.capabilitySocket.getCapabilityAdded().subscribe(msg => {
            this.loadCapabilities().pipe(take(1)).subscribe((newCapabilities: Capability[]) => {
                this.observer.next(newCapabilities);
            });
        });
        return this.createObservable();

    }

    /**
     * Loads all capabilities from GraphDB with a single HTTP request
     */
    private loadCapabilities(): Observable<Capability[]> {
        const apiURL = `${this.apiRoot}/capabilities`;
        return this.http.get<CapabilityDto[]>(apiURL).pipe(
            map((data: CapabilityDto[]) => data.map(capabilityDto => new Capability(capabilityDto))
            ));
    }

    private createObservable(): Observable<Capability[]> {
        return new Observable(observer => {
            this.observer = observer;
        });
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

    deleteCapability(capabilityIri: string) {
        const encodedIri = encodeURIComponent(capabilityIri);
        const apiUrl = `${this.apiRoot}/capabilities/${encodedIri}`;
        return this.http.delete(apiUrl);
    }
}
