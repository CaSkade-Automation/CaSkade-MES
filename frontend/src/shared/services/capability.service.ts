import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Capability } from '../../../../shared/models/capability/Capability';
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


    // TODO: Add skills
    getAllCapabilitiesOfModule(moduleIri: string): Observable<Capability[]> {

        return this.getCapabilitiesOfModuleWithoutSkills(moduleIri).pipe(flatMap((capabilities: Capability[]) => {
            const skills$ = capabilities.map(capability => this.skillService.getSkillsOfCapability(capability.iri));
            return forkJoin(skills$).pipe(map(skills =>
                skills.map((skills, i) => {
                    const capability = capabilities[i];
                    capability.addSkills(skills);
                    return capability;
                })

            ));
        }));


    }

    // return this.getAllModules().pipe(flatMap((modules: ProductionModule[]) => {
    //     const capabilities$ = modules.map(module => this.capabilityService.getAllCapabilitiesOfModule(module.iri));
    //     return forkJoin(capabilities$).pipe(map(capabilities=>
    //         capabilities.map((capability, i) => {
    //             const module = modules[i];
    //             console.log(module);
    //             module.addCapabilities(capability);
    //             return module;
    //         })
    //     ));
    // }));


    private getCapabilitiesOfModuleWithoutSkills(moduleIri: string): Observable<Capability[]> {
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
        return;
    }

}
