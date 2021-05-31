import { Component, OnInit } from '@angular/core';
import { CapabilityService } from 'src/shared/services/capability.service';
import { Capability } from '../../../../shared/models/capability/Capability';
import { SkillService } from 'src/shared/services/skill.service';
import { Skill } from '../../../../shared/models/skill/Skill';

@Component({
    selector: 'app-capability-overview',
    templateUrl: './capability.component.html',
})
export class CapabilityComponent {
}
