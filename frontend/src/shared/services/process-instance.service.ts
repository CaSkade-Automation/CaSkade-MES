import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProcessInstance, ProcessInstanceDto } from '@shared/models/ProcessInstance/ProcessInstance';

@Injectable({
    providedIn: 'root'
})
export class ProcessInstanceService {
    engineRestRoot = "/engine-rest/process-instance";

    constructor(private http: HttpClient) { }

    /**
     * Loads all process instances
     */
    getAllProcessInstances(): Observable<ProcessInstance[]> {
        return this.http.get<ProcessInstanceDto[]>(this.engineRestRoot).pipe(
            take(1),
            map((data: ProcessInstanceDto[]) => data.map(processInstDto => new ProcessInstance(processInstDto))));
    }

    /**
     * Suspends or unsuspends an instance depending on the value passed to "suspended"
     * @param processInstanceId ID of the instance to suspend / activate
     * @param suspended If true, suspends the instance
     * @returns
     */
    suspendInstance(processInstanceId: string, suspended: boolean): Observable<void> {
        const url = `${this.engineRestRoot}/${processInstanceId}/suspended`;
        const body = {
            suspended: suspended
        };
        return this.http.put<void>(url, body).pipe(take(1));
    }

    /**
     * Get the tree of currently active activity instances of a given process instance
     */
    getActivityInstance(processInstanceId: string): Observable<ActivityInstanceTree> {
        const url = `${this.engineRestRoot}/${processInstanceId}/activity-instances`;
        return this.http.get<ActivityInstanceTree>(url).pipe(take(1));
    }
}




export class ActivityInstanceTree {
    // id -> activity instance id
    // activityId -> activity id
    // childActivityInstances -> A list of child activity instances.
    // childTransitionInstances	-> A list of child transition instances. A transition instance
    //                              represents an execution waiting in an asynchronous continuation.
    // executionIds -> A list of execution ids.

    constructor(
        public id: string,
        public activityId: string,
        public activityName: string,
        public activityType: string,
        public processInstanceId: string,
        public processDefinitionId: string,
        public childActivityInstances: Array<ActivityInstanceTree>,
        public childTransitionInstances: Array<any>,
        public executionIds: Array<string>,
        public incidentIds: Array<string>,
    ) {}

}
