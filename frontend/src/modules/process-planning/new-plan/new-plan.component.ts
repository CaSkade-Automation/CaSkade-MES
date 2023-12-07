import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormArray, Validators, FormGroup } from '@angular/forms';
import { CapabilityService } from '../../../shared/services/capability.service';
import { Observable, filter, map } from 'rxjs';
import { Capability } from '../../../shared/models/Capability';
import { ProcessPlanningService } from '../../../shared/services/process-planning.service';
import { ActivatedRoute, Router } from '@angular/router';
import { state, trigger } from '@angular/animations';
import { style } from 'd3';


@Component({
    selector: 'new-plan',
    templateUrl: './new-plan.component.html',
})
export class NewOrderComponent implements OnInit {

    requiredCapabilities$: Observable<Capability[]>
    showPlanningInProgress = false;
    logicInterpretations = ["<", "<=", "=", "=>", ">"];

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
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.requiredCapabilities$ = this.capabilityService.getCapabilities()
            .pipe(
                map(caps => caps.filter(cap => cap.capabilityType.iri == "http://www.w3id.org/hsu-aut/cask#RequiredCapability"))
            );

        // If the required capability is selected / changed, the form needs to add form controls for the properties of the selected capability
        this.orderInquiryForm.get('requiredCapability').valueChanges.subscribe(change => {
            const propertyFormGroup = this.orderInquiryForm.get('properties') as FormGroup;
            const requiredCapabilityInputs = this.requiredCapability.inputs;
            const requiredCapabilityOutputs = this.requiredCapability.outputs;
            requiredCapabilityInputs.forEach(input => {
                propertyFormGroup.addControl(input.getLocalName(), this.fb.control(""));
            });
            requiredCapabilityOutputs.forEach(output => {
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
            propertyName: this.fb.control(""),
            relation: this.fb.control(""),
            value: this.fb.control(""),
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
            capabilityA: this.fb.control(""),
            relation: this.fb.control(""),
            capabilityB: this.fb.control(""),
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
            capability: this.fb.control(""),
            step: this.fb.control(""),
            isApplied: this.fb.control(false),
        });
        this.partialSolutions.push(newPartialSolutionConstraint);
    }

    deletePartialSolution(index: number): void {
        this.partialSolutions.removeAt(index);
    }


    onSubmit(): void {
        this.showPlanningInProgress = true;
        this.planningService.createProcessPlan().subscribe(plan => {
            // Stop loading animation and set plan to service so it can be retrieved in the next component
            this.showPlanningInProgress = false;
            this.planningService.currentPlan = plan;
            this.router.navigate(['../check-plan'], {relativeTo: this.route});
        });

    }

}


