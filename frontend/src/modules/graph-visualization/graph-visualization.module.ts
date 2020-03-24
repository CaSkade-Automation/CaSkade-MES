import { NgModule } from '@angular/core';
import { GraphVisualizationComponent } from './graph-visualization.component';
import {GraphVisualizationRouter} from './graph-visualization.routing';
import { ModuleService } from 'app/shared/services/module.service';

@NgModule({
  imports: [
    GraphVisualizationRouter,
  ],
  declarations: [GraphVisualizationComponent],
  providers: [
    ModuleService,
  ]
})
export class GraphVisualizationModule { }
