import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Capability } from '../../../../shared/models/capability/Capability';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Skill } from '../../../../shared/models/skill/Skill';

@Injectable({
    providedIn: 'root'
})
export class SkillService {
    apiRoot = "/api";

    constructor(
        private http: HttpClient
    ) { }

    // TODO: Implement
    getAllSkills(): Observable<Skill[]> {
        return;
    }


    //TODO
    /**
     * Returns a skill with a given IRI
     * @param skillIri IRI of the skill to return
     */
    getSkillByIri(skillIri: string): Observable<Skill> {
        return;
    }


    // TODO: Implement
    getAllSkillsOfModule(moduleIri: string): Observable<Skill[]> {
        return;
    }


    getAllSkillsOfCapability(capabilityIri: string): Observable<Skill[]> {
        const encodedModuleIri = encodeURIComponent(capabilityIri);
        const apiURL = `${this.apiRoot}/modules/${encodedModuleIri}/capabilities`;
        return this.http.get<Skill[]>(apiURL).pipe(
            map(
                (data: Skill[]) => data.map(skill => {
                    return new Skill(skill.iri, skill.stateMachine, skill.currentState);
                })
            ));
    }


}
