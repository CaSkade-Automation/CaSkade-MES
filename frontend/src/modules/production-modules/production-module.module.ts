// Angular
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// Routing
import { ModuleManagementRouter } from './production-module.routing';
import { ProductionModuleComponent } from './production-module.component';
import { SkillExecutionService } from '../../shared/services/skill-execution.service';
import { CommandFeatureModule } from 'src/shared/command-feature/command-feature.module';
import { ModuleGraphVisuComponent } from './module-graph-visu/module-graph-visu.component';
import { ModuleOverviewComponent } from './module-overview/module-overview.component';
import { ModuleRegistrationComponent } from './module-registration/module-registration.component';
import { ManualRegistrationModule } from 'src/shared/modules/manual-registration/manual-registration.module';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        ModuleManagementRouter,
        FormsModule,
        CommandFeatureModule,
        ManualRegistrationModule
    ],
    declarations: [
        ProductionModuleComponent,
        ModuleGraphVisuComponent,
        ModuleOverviewComponent,
        ModuleRegistrationComponent
    ],
    providers: [
        SkillExecutionService
    ]
})
export class ModuleManagementModule { }
