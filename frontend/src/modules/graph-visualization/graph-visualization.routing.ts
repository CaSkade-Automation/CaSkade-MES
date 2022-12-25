import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {GraphVisualizationComponent} from './graph-visualization.component';

const routes: Routes = [
    { path: ':entityType/:moduleName',
        component: GraphVisualizationComponent,

    },
    {path:':entityType', component: GraphVisualizationComponent

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class GraphVisualizationRouter {}
