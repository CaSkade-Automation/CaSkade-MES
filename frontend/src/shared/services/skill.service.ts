import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, startWith, take } from 'rxjs/operators';
import { SkillDto } from '@shared/models/skill/Skill';
import { Skill } from '../models/Skill';
import { SkillSocketService } from './sockets/skill-socket.service';

@Injectable({
    providedIn: 'root'
})
export class SkillService {
    apiRoot = "/api";

    private skillSubject$ = new BehaviorSubject<Skill[]>([]);

    private onSkillsAdded$ = this.skillSocket.onSkillsAdded();
    private onSkillDeleted$ = this.skillSocket.onSkillDeleted();

    constructor(
        private http: HttpClient,
        private skillSocket: SkillSocketService
    ) {
        this.loadSkillsAndSubscribe();
    }

    /**
     * Get all skills that are currently registered
     */
    getSkills(): Observable<Skill[]> {
        return this.skillSubject$.asObservable();
    }

    public loadSkillsAndSubscribe(): void {
        this.loadSkills().subscribe(skillDtos => {
            const initialSkills = skillDtos;
            // on adding, we get the current skills, so update
            this.onSkillsAdded$.pipe(startWith(initialSkills)).subscribe(addedSkills => {
                const allSkills = [...this.skillSubject$.value, ...addedSkills];
                this.skillSubject$.next(allSkills);
            });

            // on deleting, we also get the current skills, so update
            this.onSkillDeleted$.subscribe(skills => {
                this.skillSubject$.next(skills);
            });
        });
    }

    public reloadSkills(): void {
        this.loadSkills().subscribe(skills => {
            this.skillSubject$.next(skills);
        });
    }

    /**
     * Loads all currently available skills from the GraphDB
     * @returns An observable of all available skills
     */
    private loadSkills(): Observable<Skill[]> {
        const apiURL = `${this.apiRoot}/skills`;
        return this.http.get<SkillDto[]>(apiURL).pipe(
            take(1),
            map((skillDtos: SkillDto[]) => skillDtos.map(dto => new Skill(dto))),
        );
    }


    /**
     * Returns a skill with a given IRI
     * @param skillIri IRI of the skill to return
     */
    getSkillByIri(skillIri: string): Observable<Skill> {
        const encodedSkillIri = encodeURIComponent(skillIri);
        const apiURL = `${this.apiRoot}/skills/${encodedSkillIri}`;

        return this.http.get<SkillDto>(apiURL).pipe(
            map((data: SkillDto) => new Skill(data))
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
