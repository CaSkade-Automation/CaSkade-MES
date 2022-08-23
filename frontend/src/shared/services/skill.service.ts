import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SkillDto } from '@shared/models/skill/Skill';
import { Skill } from '../models/Skill';

@Injectable({
    providedIn: 'root'
})
export class SkillService {
    apiRoot = "/api";

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Get all skills that are currently registered
     */
    getAllSkills(): Observable<Skill[]> {
        const apiURL = `${this.apiRoot}/skills`;

        return this.http.get<SkillDto[]>(apiURL).pipe(
            map(
                (data: SkillDto[]) => data.map(skillDto => {
                    return new Skill(skillDto);
                })
            ));
    }


    /**
     * Returns a skill with a given IRI
     * @param skillIri IRI of the skill to return
     */
    getSkillByIri(skillIri: string): Observable<Skill> {
        const encodedSkillIri = encodeURIComponent(skillIri);
        const apiURL = `${this.apiRoot}/skills/${encodedSkillIri}`;

        return this.http.get<SkillDto>(apiURL).pipe(
            map(
                (data: SkillDto) => new Skill(data))
        );
    }


    getAllSkillsOfModule(moduleIri: string): Observable<Skill[]> {
        const encodedModuleIri = encodeURIComponent(moduleIri);
        const apiURL = `${this.apiRoot}/modules/${encodedModuleIri}/skills`;

        return this.http.get<SkillDto[]>(apiURL).pipe(
            map(
                (data: SkillDto[]) => data.map(skillDto => {
                    return new Skill(skillDto);
                })
            ));
    }


    getSkillsOfCapability(capabilityIri: string): Observable<Skill[]> {
        const encodedCapabilityIri = encodeURIComponent(capabilityIri);
        const apiURL = `${this.apiRoot}/capabilities/${encodedCapabilityIri}/skills`;

        return this.http.get<SkillDto[]>(apiURL).pipe(
            map(
                (data: SkillDto[]) => data.map(skillDto => {
                    return new Skill(skillDto);
                })
            ));
    }
    addSkill(ontologyString: string): Observable<Record<string, any>> {
        const apiURL = `${this.apiRoot}/skills`;
        const headers = new HttpHeaders({"content-type": "text/turtle"});
        return this.http.post<SkillDto>(apiURL, ontologyString, {headers: headers});
    }


    addMtpSkill(ontologyFile: File): Observable<File>{
        const apiURL = `${this.apiRoot}/Mtp`;
        const formData= new FormData;
        formData.append('file', ontologyFile, ontologyFile.name);
        return this.http.post<File>(apiURL, formData);
    }

    /**
     * Deletes (better: unregisters) a skill from SkillMEx by removing it from the connected triple store
     * @param skillIri IRI of the skill to unregister
     * @returns
     */
    deleteSkill(skillIri: string): Observable<Record<string, any>> {
        const encodedSkillIri = encodeURIComponent(skillIri);
        const apiUrl = `${this.apiRoot}/skills/${encodedSkillIri}`;
        return this.http.delete(apiUrl);
    }

}
