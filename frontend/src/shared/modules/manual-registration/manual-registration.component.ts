import { Component, Input} from '@angular/core';
import { ModuleService } from '../../../shared/services/module.service';
import { SkillService } from '../../../shared/services/skill.service';
import { CapabilityService } from '../../../shared/services/capability.service';
import { HttpClient } from "@angular/common/http";
import { NgIf } from '@angular/common';

@Component({
    selector: 'manual-registration',
    templateUrl: './manual-registration.component.html',
    styleUrls: ['./manual-registration.component.scss']
})
export class ManualRegistrationComponent {
@Input() context: string
constructor(private httpClient: HttpClient,
    private moduleService: ModuleService,
    private skillService: SkillService,
    private capabilityService: CapabilityService) {}
    
    ontologyString="Enter Ontology here";
    errMessage: any;
    saveOntology() { 
        console.log(this.context);
        //Fallunterscheidung
        if(this.context=="module"){
            console.log(this.ontologyString);
            this.moduleService.addModule(this.ontologyString).subscribe(null,
                (err) => this.errMessage = err.error.message,
                () => {
                    this.errMessage = "";
                    this.ontologyString="Ontology registered"; //Variablenwert wird nicht in ontologyString gespeichert
                }
            );     
        }
        if(this.context=="skill"){
            console.log(this.ontologyString);
            this.skillService.addSkill(this.ontologyString).subscribe(null,
                (err) => this.errMessage = err.error.message,
                () => {
                    this.errMessage = "";
                    this.ontologyString="Ontology registered"; //Variablenwert wird nicht in ontologyString gespeichert
                }
            ); 
        }
        if(this.context=="capability"){
            console.log(this.ontologyString);
            this.capabilityService.addCapability(this.ontologyString).subscribe(null,
                (err) => this.errMessage = err.error.message,
                () => {
                    this.errMessage = "";
                    this.ontologyString="Ontology registered"; //Variablenwert wird nicht in ontologyString gespeichert
                }
            );
            
        }
      
            
    }

 
}