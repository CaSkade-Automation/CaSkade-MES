import { Component, OnInit } from '@angular/core';
import { SkillService } from 'src/shared/services/skill.service';
import { Skill } from '../../../shared/models/Skill';

@Component({
    selector: 'skill-overview',
    templateUrl: './skill-overview.component.html',
    styleUrls: ['./skill-overview.component.scss']
})
export class SkillOverviewComponent implements OnInit {

    skills= new Array<Skill>();

    constructor(
        private skillService: SkillService
    ) {}

    ngOnInit(): void {
        this.skillService.getAllSkills().subscribe((skills: Skill[]) =>{
            this.skills=skills;
        });

    }
}

