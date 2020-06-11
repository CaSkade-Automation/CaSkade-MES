import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderQueryService {

  query_allManufacturingProcesses = `PREFIX DIN8580: <http://www.hsu-ifa.de/ontologies/DIN8580#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  select ?class where { 
      ?class rdfs:subClassOf DIN8580:Fertigungsverfahren.
      FILTER(?class != owl:Nothing).
  }`;
  
  constructor(private httpClient: HttpClient) {}
  
  getAllManufacturingProcesses(){
    return this.httpClient.post('api/graph-operations/queries', this.query_allManufacturingProcesses).pipe(map(
      (data:any) => {
        const obj = JSON.parse(data)
        const array = new Array();

        obj.results.bindings.forEach(binding => {
          const value = binding.class.value as string;
          const processName = value.slice(value.lastIndexOf('#')+1 ,(value.length));
          array.push(processName)
        });
        return array;
        
      } 
    ));
  }

}