import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SkillmexConfigurationRoutingModule } from './skillmex-configuration.routing';
import { SkillMexConfigurationComponent } from './skillmex-configuration.component';
import { GraphDbSettingsComponent } from './subcomponents/graphdb-settings.component';
import { GraphDbRepoService } from '../../shared/services/graphDbRepoService.service';
import { MtpMappingSettingsComponent } from './subcomponents/mtp-mapping-settings.component';


@NgModule({
    imports: [CommonModule, FormsModule, SkillmexConfigurationRoutingModule],
    declarations: [SkillMexConfigurationComponent, GraphDbSettingsComponent, MtpMappingSettingsComponent],
    providers:[GraphDbRepoService]
})
export class SkillMexConfigurationModule {}
