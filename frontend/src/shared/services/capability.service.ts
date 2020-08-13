import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Capability, CapabilityDto } from '../../../../shared/models/capability/Capability';
import { HttpClient } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';
import { SkillService } from './skill.service';

@Injectable({
    providedIn: 'root'
})
export class CapabilityService {
    apiRoot = "/api";

    constructor(
        private http: HttpClient,
        private skillService: SkillService
    ) { }


    /**
     * Returns all capabilities that are currently registered
     */
    getAllCapabilities(): Observable<Capability[]> {
        const apiURL = `${this.apiRoot}/capabilities`;
        return this.http.get<CapabilityDto[]>(apiURL).pipe(
            map((data: CapabilityDto[]) => data.map(capabilityDto => new Capability(capabilityDto))
            ));
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
        return this.http.post<CapabilityDto>(apiURL, ontologyString);
    }
}
