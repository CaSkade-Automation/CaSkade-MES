import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormArray, Validators, FormGroup } from '@angular/forms';
import { CapabilityService } from '../../../shared/services/capability.service';
import { Observable, filter, map, tap } from 'rxjs';
import { Capability } from '../../../shared/models/Capability';
import { ProcessPlanningService } from '../../../shared/services/process-planning.service';
import { ActivatedRoute, Router } from '@angular/router';
import { state, trigger } from '@angular/animations';
import { style } from 'd3';
import { Property } from '../../../shared/models/Property';
import { PropertyService } from '../../../shared/services/property.service';


@Component({
    selector: 'new-plan',
    templateUrl: './new-plan.component.html',
})
export class NewOrderComponent implements OnInit {

    requiredCapabilities$: Observable<Capability[]>;
    providedCapabilities$: Observable<Capability[]>;
    properties$: Observable<Property[]>
    showPlanningInProgress = false;
    logicInterpretations = ["<", "<=", "=", "=>", ">"];
    sequenceRelations = ["before", "strictly before", "parallel to", "strictly after", "after"];
    solutionOptions = [{
        text: "must be applied",
        value: true
    },
    {
        text: "must not be applied",
        value: false
    }]

    orderInquiryForm = this.fb.group({
        requiredCapability: this.fb.control(null, Validators.required),
        properties: this.fb.group({}),
        propertyConstraints: this.fb.array([]),
        sequenceConstraints: this.fb.array([]),
        partialSolutionConstraints: this.fb.array([])
    })


    constructor(
        private fb: FormBuilder,
        private capabilityService: CapabilityService,
        private planningService: ProcessPlanningService,
        private propertyService: PropertyService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.requiredCapabilities$ = this.capabilityService.getCapabilities()
            .pipe(
                tap(data => console.log(data)),
                map(caps => caps.filter(cap => cap.capabilityType.iri == "http://www.w3id.org/hsu-aut/cask#RequiredCapability"))
            );
        this.providedCapabilities$ = this.capabilityService.getCapabilities()
            .pipe(
                map(caps => caps.filter(cap => cap.capabilityType.iri == "http://www.w3id.org/hsu-aut/cask#ProvidedCapability"))
            );

        this.properties$ = this.propertyService.getProperties();


        // If the required capability is selected / changed, the form needs to add form controls for the properties of the selected capability
        this.orderInquiryForm.get('requiredCapability').valueChanges.subscribe(change => {
            const propertyFormGroup = this.orderInquiryForm.get('properties') as FormGroup;
            const requiredCapabilityInputProperties = this.requiredCapability.inputProperties;
            const requiredCapabilityOutputProperties = this.requiredCapability.outputProperties;
            requiredCapabilityInputProperties.forEach(input => {
                propertyFormGroup.addControl(input.getLocalName(), this.fb.control(""));
            });
            requiredCapabilityOutputProperties.forEach(output => {
                propertyFormGroup.addControl(output.getLocalName(), this.fb.control(""));
            });
        });
    }

    get requiredCapability(): Capability {
        return this.orderInquiryForm.get('requiredCapability').value;
    }

    get propertyConstraints(): FormArray {
        return this.orderInquiryForm.get('propertyConstraints') as FormArray;
    }

    addNewPropertyConstraint(): void {
        const newPropertyConstraint = this.fb.group({
            propertyName: this.fb.control("", Validators.required),
            relation: this.fb.control(this.logicInterpretations[0], Validators.required),
            value: this.fb.control("", Validators.required),
        });
        this.propertyConstraints.push(newPropertyConstraint);
    }

    deletePropertyConstraint(index: number): void {
        this.propertyConstraints.removeAt(index);
    }

    get sequenceConstraints(): FormArray {
        return this.orderInquiryForm.get('sequenceConstraints') as FormArray;
    }

    addNewSequenceConstraint(): void {
        const newSequenceConstraint = this.fb.group({
            capabilityA: this.fb.control("", Validators.required),
            relation: this.fb.control(this.sequenceRelations[0], Validators.required),
            capabilityB: this.fb.control("", Validators.required)
        });
        this.sequenceConstraints.push(newSequenceConstraint);
    }

    deleteSequenceConstraint(index: number): void {
        this.sequenceConstraints.removeAt(index);
    }

    get partialSolutions(): FormArray {
        return this.orderInquiryForm.get('partialSolutionConstraints') as FormArray;
    }

    addNewPartialSolution(): void {
        const newPartialSolutionConstraint = this.fb.group({
            capabilityA: this.fb.control(""),
            isApplied: this.fb.control(false),
            step: this.fb.control(""),
        });
        this.partialSolutions.push(newPartialSolutionConstraint);
    }

    deletePartialSolution(index: number): void {
        this.partialSolutions.removeAt(index);
    }


    submit(): void {
        this.showPlanningInProgress = true;
        this.planningService.createProcessPlan().subscribe(plan => {
            // Stop loading animation and set plan to service so it can be retrieved in the next component
            this.showPlanningInProgress = false;
            this.planningService.currentPlan = plan;
            this.router.navigate(['../check-plan'], {relativeTo: this.route});
        });
    }

}


