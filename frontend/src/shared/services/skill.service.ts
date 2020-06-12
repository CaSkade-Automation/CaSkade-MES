import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Capability } from '../../../../shared/models/capability/Capability';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
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


    getSkillsOfCapability(capabilityIri: string): Observable<Skill[]> {
        console.log(`Getting skills of capability ${capabilityIri}`);

        const encodedCapabilityIri = encodeURIComponent(capabilityIri);
        const apiURL = `${this.apiRoot}/capabilities/${encodedCapabilityIri}/skills`;
        return this.http.get<Skill[]>(apiURL).pipe(
            tap(data => console.log(data)),
            map(
                (data: Skill[]) => data.map(skill => {
                    return new Skill(skill.iri, skill.stateMachine, skill.currentState);
                })
            ));
    }


}
