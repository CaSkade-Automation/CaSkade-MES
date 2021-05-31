import { Component } from '@angular/core';
import { ModuleService } from '../../../shared/services/module.service';
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'app-module-registration',
    templateUrl: './module-registration.component.html',
    styleUrls: ['./module-registration.component.scss']
   
})
export class ModuleRegistrationComponent {

    constructor(private httpClient: HttpClient,
                private moduleService: ModuleService,) { }

    ontologyString="Enter Ontology here";
    errMessage: any;
    saveOntology() { 
        console.log(this.ontologyString);
        this.moduleService.addModule(this.ontologyString).subscribe(null,
            (err) => this.errMessage = err.error.message,
            () => {
                this.errMessage = "";
                this.ontologyString="Ontology registered"; //Variablenwert wird nicht in ontologyString gespeichert
            }
        );     
            
    }
}