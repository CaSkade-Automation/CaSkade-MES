import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ServiceExecutionDescription } from "./self-description";
import { map } from 'rxjs/operators';

@Injectable()

export class ManufacturingServiceExecutor {
  
    constructor(private http: HttpClient) {}

    executeService(executionDescription:ServiceExecutionDescription) {
      console.log(`service called`);
      console.log(executionDescription);

      // construct the request
      let headers = new HttpHeaders();
      executionDescription.parameters.forEach(parameter => {
        if (parameter.getShortType() == "HeaderParameter") {
          headers.set(parameter.name, parameter.value);
        }
      });

      let queryParams = new HttpParams();
      executionDescription.parameters.forEach(parameter => {
        if (parameter.getShortType() == "QueryParameter") {
          queryParams.set(parameter.name, parameter.value);
        }
      });
            
      let request = new HttpRequest(executionDescription.methodType, executionDescription.fullPath, {
        "headers": headers,
        "params": queryParams
      })

      this.http.request(request).subscribe(res => {console.log(JSON.stringify(res))});
    }

 
}