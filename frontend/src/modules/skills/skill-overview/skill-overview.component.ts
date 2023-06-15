import { Component, OnInit } from '@angular/core';
import { SkillService } from 'src/shared/services/skill.service';
import { Skill } from '../../../shared/models/Skill';
import { Observable } from 'rxjs';

@Component({
    selector: 'skill-overview',
    templateUrl: './skill-overview.component.html',
    styleUrls: ['./skill-overview.component.scss']
})
export class SkillOverviewComponent implements OnInit {

    // Subscription to all skills that is always updated through sockets and subscribed to using the async pipe
    skills$: Observable<Array<Skill>>;

    constructor(
        private skillService: SkillService
    ) {}

    ngOnInit(): void {
        this.skills$ = this.skillService.getSkills();
    }

    reloadSkills(): void {
        this.skillService.reloadSkills();
    }
}

