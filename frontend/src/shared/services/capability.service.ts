import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Capability } from '../../../../shared/models/capability/Capability';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CapabilityService {
    apiRoot = "/api";

    constructor(
        private http: HttpClient
    ) { }


    // TODO: Add skills
    getAllCapabilitiesOfModule(moduleIri: string): Observable<Capability[]> {
        const encodedModuleIri = encodeURIComponent(moduleIri);
        const apiURL = `${this.apiRoot}/modules/${encodedModuleIri}/capabilities`;
        return this.http.get<Capability[]>(apiURL).pipe(
            map((data: Capability[]) => data.map(capability => {
                return new Capability(capability.iri, capability.inputs, capability.outputs);
            })
            ));
    }


    // TODO: Implement
    getAllCapabilities(): Observable<Capability[]> {
        return;
    }

    //TODO
    /**
     * Returns a capability with a given IRI
     * @param capabilityIri IRI of the capability to return
     */
    getCapabilityByIri(capabilityIri: string): Observable<Capability> {

    }

}
