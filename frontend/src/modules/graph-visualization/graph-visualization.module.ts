import { NgModule } from '@angular/core';
import { GraphVisualizationComponent } from './graph-visualization.component';
import {GraphVisualizationRouter} from './graph-visualization.routing';
import { ModuleService } from '../../shared/services/module.service';
import { NodeCreatorService } from './node-creator.service';

@NgModule({
    imports: [
        GraphVisualizationRouter,
    ],
    declarations: [
        GraphVisualizationComponent
    ],
    providers: [
        ModuleService,
        NodeCreatorService

    ]
})
export class GraphVisualizationModule { }
