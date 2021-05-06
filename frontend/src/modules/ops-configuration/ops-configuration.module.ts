import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OpsConfigurationRoutingModule } from './ops-configuration.routing';
import { OpsConfigurationComponent } from './ops-configuration.component';
import { GraphDbSettingsComponent } from './subcomponents/graphdb-settings.component';
import { GraphDbRepoService } from '../../shared/services/graphDbRepoService.service';
import { MtpMappingSettingsComponent } from './subcomponents/mtp-mapping-settings.component';


@NgModule({
    imports: [CommonModule, FormsModule, OpsConfigurationRoutingModule],
    declarations: [OpsConfigurationComponent, GraphDbSettingsComponent, MtpMappingSettingsComponent],
    providers:[GraphDbRepoService]
})
export class OpsConfigurationModule {}
