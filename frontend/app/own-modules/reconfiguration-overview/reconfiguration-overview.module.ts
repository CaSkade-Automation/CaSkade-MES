// Angular
import { NgModule } from '@angular/core';

// Routing
import { ReconfigurationOverviewRouter } from './reconfiguration-overview.routing';
import { ReconfigurationOverviewComponent } from './reconfiguration-overview.component';
// Components


@NgModule({
  imports: [
    ReconfigurationOverviewRouter,
  ],
  declarations: [
    ReconfigurationOverviewComponent,
  ]
})
export class ReconfigurationOverviewModule { }
