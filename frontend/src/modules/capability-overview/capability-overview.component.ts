import { Component, OnInit } from '@angular/core';
import { CapabilityService } from 'src/shared/services/capability.service';
import { Capability } from '../../../../shared/models/capability/Capability';
import { SkillService } from 'src/shared/services/skill.service';
import { Skill } from '../../../../shared/models/skill/Skill';

@Component({
    selector: 'app-capability-overview',
    templateUrl: './capability-overview.component.html',
    styleUrls: ['./capability-overview.component.scss']
})
export class CapabilityOverviewComponent implements OnInit {

    constructor(
    private capabilityService: CapabilityService,
    private skillService: SkillService
    ) { }
capabilities= new Array<Capability>();
skillsOfModule = new Array<Skill>();
ngOnInit() {
    console.log("init");
    this.capabilityService.getAllCapabilities().subscribe((capabilities: Capability[])=>{
        this.capabilities=capabilities;

    });
    
}

getSkills(capability): void{
    this.skillService.getSkillsOfCapability(capability).subscribe((skills: Skill[])=>{
 
        this.skillsOfModule=skills;
        console.log(this.skillsOfModule);
    });
 
}
}
