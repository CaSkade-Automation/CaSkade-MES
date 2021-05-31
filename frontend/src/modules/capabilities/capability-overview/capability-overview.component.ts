import { Component, OnInit } from '@angular/core';
import { CapabilityService } from 'src/shared/services/capability.service';
import { Capability } from '@shared/models/capability/Capability';
import { SkillService } from 'src/shared/services/skill.service';
import { Skill } from '@shared/models/skill/Skill';

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
    executableCapabilities= new Array<ExecutableCapability>();
    skills= new Array<Skill>();
    ngOnInit() {
        console.log("init");


        this.skillService.getAllSkills().subscribe((skills: Skill[]) =>{
            this.skills=skills;
        });

        this.skills.forEach(skill => {
            skill.relatedCapabilities.forEach(capability => {
                const foundCapability= this.executableCapabilities.find(cap=>cap.capability.iri==capability.iri);
                if (foundCapability== undefined){
                    this.executableCapabilities.push(new ExecutableCapability(capability, skill));
                }
                else {
                    foundCapability.skills.push(skill);
                }
            });

        });
    }

    /*getSkills(capability): void{
    this.skillService.getSkillsOfCapability(capability).subscribe((skills: Skill[])=>{
        this.skillsOfModule=skills;
        console.log(this.skillsOfModule);
    });

}*/

}



class ExecutableCapability{
    skills= new Array<Skill>();
    constructor(public capability: Capability, skill: Skill ){
        this.skills.push(skill);
    }
}
