import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {  SkillExecutionRequestDto } from '@shared/models/skill/SkillExecutionRequest';
import { map } from 'rxjs/operators';
import { SkillVariableDto } from "@shared/models/skill/SkillVariable";

@Injectable({
    providedIn: 'root'
}

)
export class SkillExecutionService {

    constructor(private http: HttpClient) {}

    executeService(executionDescription: SkillExecutionRequestDto): Observable<any> {
        return this.http.post(`api/skill-executions`, executionDescription);
    }

    setParameters(skillIri: string, skillParameters: SkillVariableDto[]): Observable<any> {
        const encodedIri = encodeURIComponent(skillIri);
        console.log(`trying to send to: ${encodedIri}`);
        return this.http.put(`api/skills/${encodedIri}/parameters`, skillParameters);
    }

}
