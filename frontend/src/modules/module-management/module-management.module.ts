// Angular
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

// Routing
import { ModuleManagementRouter } from './module-management.routing';
import { ModuleManagementComponent } from './module-management.component';
import { SkillExecutor } from '../../shared/services/skill-execution.service';
import { CommandFeatureComponent } from 'src/shared/command-feature/command-feature.component';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        ModuleManagementRouter,
        FormsModule
    ],
    declarations: [
        ModuleManagementComponent,
        CommandFeatureComponent
        
    ],
    providers: [
        SkillExecutor
    ]
})
export class ModuleManagementModule { }
