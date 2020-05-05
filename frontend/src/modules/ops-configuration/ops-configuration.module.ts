import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OpsConfigurationRoutingModule } from './ops-configuration.routing';
import { OpsConfigurationComponent } from './ops-configuration.component';
import { GraphDbSettingsComponent } from './subcomponents/graphdb-settings.component';
import { GraphDbRepoService } from '../../shared/services/GraphDbRepoService.service';


@NgModule({
    imports: [CommonModule, FormsModule, OpsConfigurationRoutingModule],
    declarations: [OpsConfigurationComponent, GraphDbSettingsComponent],
    providers:[GraphDbRepoService]
})
export class OpsConfigurationModule {}
