import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'ontology-registration',
    templateUrl: './ontology-registration.component.html',
    styleUrls: ['./ontology-registration.component.scss']
})
export class OntologyRegistrationComponent implements OnInit{

    context: string;
    ontologyType = "manualOntology"

    constructor(private router: Router) {}

    ngOnInit(): void {
        // Extract the context out of the route (can be one of modules, skills, capabilities)
        // Context needs to be passed to the child components
        const url = this.router.url;
        this.context = url.match(/production-modules|skills|capabilities/)[0];
    }

}
