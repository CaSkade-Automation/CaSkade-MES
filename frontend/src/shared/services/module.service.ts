import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Process, ManufacturingModule } from "../models/self-description";
import { ProductionModule } from "../../../../shared/models/production-module/ProductionModule";
import { map } from 'rxjs/operators';
import { Module } from "../models/module";

@Injectable()
export class ModuleService {
  apiRoot: string = "/api";
  constructor(private http: HttpClient) { }


  // Returns fake data for Tom
  // TODO: Return real data
  getAllModulesWithCapabilitiesAndSkills(): Module[] {
    const fakeModules: Module[] = [{
      name: "Bohrmodul",
      capabilities: [{
        name: "Bohren",
        hasInput: [{ name: "Rohteil", stateType: "Product" }, { name: "Bohrungsinfos", stateType: "Information" }],
        hasOutput: [{ name: "Fertigteil", stateType: "Product" }],
        executableViaSkill: [{name: "Bohren_RestSkill"}, {name: "Bohren_OpcUaSkill"}]
      }]
    },
    {
      name: "Fräsmodul",
      capabilities: [{
        name: "Fräsen",
        hasInput: [{ name: "Rohteil", stateType: "Product" }, { name: "Fräsbahn", stateType: "Information" }],
        hasOutput: [{ name: "Fertigteil", stateType: "Product" }, { name: "Viele Späne", stateType: "Product" }],
        executableViaSkill: [{name: "Fräsen_RestSkill"}, {name: "Fräsen_OpcUaSkill"}]
      }]
    }]

    return fakeModules;
  }


  getAllModules(): Observable<ProductionModule[]> {
    let apiURL = `${this.apiRoot}/modules`;
    return this.http.get<ProductionModule[]>(apiURL).pipe(map(res => {
      let modules = new Array<ProductionModule>();
      res.forEach(element => {
        modules.push(element);
      });
      return modules;
    }));
  }


  getAllCapabilitiesOfModule(moduleIri: string): Observable<Process[]> {
    const encodedModuleIri = encodeURIComponent(moduleIri);
    let apiURL = `${this.apiRoot}/modules/${encodedModuleIri}/capabilities`;
    return this.http.get<Process[]>(apiURL).pipe(map(res => {
      let processes = new Array<Process>();
      res.forEach(element => {
        processes.push(new Process(element));
      });
      return processes;
    }));
  }

}
