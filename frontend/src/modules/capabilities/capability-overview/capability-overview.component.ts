import { Component, OnInit } from '@angular/core';
import { CapabilityService } from 'src/shared/services/capability.service';
import { SkillService } from 'src/shared/services/skill.service';
import { Subscription, tap } from 'rxjs';
import { Capability } from '../../../shared/models/Capability';
import { Skill } from '../../../shared/models/Skill';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-capability-overview',
    templateUrl: './capability-overview.component.html',
    styleUrls: ['./capability-overview.component.scss']
})
export class CapabilityOverviewComponent implements OnInit {

    constructor(
        private httpClient: HttpClient,
        private capabilityService: CapabilityService,
        private skillService: SkillService
    ) {}

    capabilities= new Array<Capability>();
    skillsOfModule = new Array<Skill>();

    showProvided = true;
    showRequired = true;

    capabilitySubscription: Subscription;

    ngOnInit(): void {
        this.capabilitySubscription = this.capabilityService.getAllCapabilities().subscribe(caps => this.capabilities = caps);
        // this.skills.forEach(skill => {
        //     skill.relatedCapabilities.forEach(capability => {
        //         const foundCapability= this.executableCapabilities.find(cap=>cap.capability.iri==capability.iri);
        //         if (foundCapability== undefined){
        //             this.executableCapabilities.push(new ExecutableCapability(capability, skill));
        //         }
        //         else {
        //             foundCapability.skills.push(skill);
        //         }
        //     });

        // });
    }

    onCapabilityDeleted(capabilityIri: string): void {
        console.log("on delete");

        // remove capability with that id from the list
        const capabilityIndex = this.capabilities.findIndex(cap => cap.iri == capabilityIri);
        this.capabilities.splice(capabilityIndex, 1);
    }

    ngOnDestroy(): void {
        this.capabilitySubscription.unsubscribe();
    }

}
