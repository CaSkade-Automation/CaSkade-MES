import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpsConfigurationComponent } from './ops-configuration.component';
import { GraphDbSettingsComponent } from './subcomponents/graphdb-settings.component';
import { MtpMappingSettingsComponent } from './subcomponents/mtp-mapping-settings.component';

const routes: Routes = [
    {
        path: '',
        component: OpsConfigurationComponent,
        children: [
            {path: '', redirectTo: 'graphdb-settings', pathMatch: 'full'},
            {path: 'graphdb-settings', component: GraphDbSettingsComponent},
            {path: 'mtp-mapping-settings', component: MtpMappingSettingsComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OpsConfigurationRoutingModule {}
