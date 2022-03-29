import { Component, OnInit } from '@angular/core';
import { CapabilityService } from 'src/shared/services/capability.service';
import { Capability } from '@shared/models/capability/Capability';
import { SkillService } from 'src/shared/services/skill.service';
import { Skill } from '@shared/models/skill/Skill';
import { tap } from 'rxjs';

@Component({
    selector: 'app-capability-overview',
    templateUrl: './capability-overview.component.html',
    styleUrls: ['./capability-overview.component.scss']
})
export class CapabilityOverviewComponent implements OnInit {

    constructor(
        private capabilityService: CapabilityService,
        private skillService: SkillService
    ) {}

    capabilities= new Array<Capability>();
    skillsOfModule = new Array<Skill>();

    showProvided = true;
    showRequired = true;


    ngOnInit() {
        this.capabilityService.getAllCapabilities()
            .pipe(tap(data => console.log(data)))
            .subscribe(data => this.capabilities = data);
        console.log("init");

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

    /*getSkills(capability): void{
    this.skillService.getSkillsOfCapability(capability).subscribe((skills: Skill[])=>{
        this.skillsOfModule=skills;
        console.log(this.skillsOfModule);
    });

}*/

}
