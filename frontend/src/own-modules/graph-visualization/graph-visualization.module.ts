import { NgModule } from '@angular/core';
import { GraphVisualizationComponent } from './graph-visualization.component';
import {GraphVisualizationRouter} from './graph-visualization.routing';

@NgModule({
  imports: [
    GraphVisualizationRouter
  ],
  declarations: [GraphVisualizationComponent]
})
export class GraphVisualizationModule { }
