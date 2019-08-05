import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ManufacturingModule, Process } from "./self-description";
import { map } from 'rxjs/operators';

@Injectable()

export class ModuleManagementService {
  apiRoot: string = "/api";
  constructor(private http: HttpClient) {}

  getAllModules(): Observable<ManufacturingModule[]> {
    let apiURL = `${this.apiRoot}/modules`;
    return this.http.get<ManufacturingModule[]>(apiURL).pipe(map(res => {
      let modules = new Array<ManufacturingModule>();
      res.forEach(element => {  
        modules.push(new ManufacturingModule(element));
      });
      return modules;
    }));
  }


  getAllProcessesOfModule(moduleIri: string):Observable<Process[]> {
    const encodedModuleIri = encodeURIComponent(moduleIri);
    let apiURL = `${this.apiRoot}/modules/${encodedModuleIri}/services`;
    return this.http.get<Process[]>(apiURL).pipe(map(res => {
      let processes = new Array<Process>();
      res.forEach(element => {  
        processes.push(new Process(element));
      });
      return processes;
    }));
  }

}