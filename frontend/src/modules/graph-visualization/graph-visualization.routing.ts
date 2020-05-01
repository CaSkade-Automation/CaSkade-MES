import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {GraphVisualizationComponent} from './graph-visualization.component';

const routes: Routes = [
  { path: 'modules/:moduleName',
  component: GraphVisualizationComponent,
  
   },
   {path:'modules', component: GraphVisualizationComponent

   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GraphVisualizationRouter {}
