import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {GraphVisualizationComponent} from './graph-visualization.component'

const routes: Routes = [
  { path: '',
  component: GraphVisualizationComponent,
  data: {
    title: 'Graph-Visualization'
  },
  children: []


   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GraphVisualizationRouter {}
