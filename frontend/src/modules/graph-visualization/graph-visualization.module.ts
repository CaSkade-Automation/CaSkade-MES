import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GraphVisualizationComponent } from './graph-visualization.component';
import {GraphVisualizationRouter} from './graph-visualization.routing';
import { NodeCreatorService } from './node-creator.service';

@NgModule({
    imports: [
        CommonModule,
        GraphVisualizationRouter,
    ],
    declarations: [
        GraphVisualizationComponent
    ],
    providers: [
        NodeCreatorService
    ]
})
export class GraphVisualizationModule { }
