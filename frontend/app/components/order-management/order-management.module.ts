// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// ngx-bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';

// Routing
import { OrderManagementRouter } from './order-management.routing';

// Components
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderManagementComponent } from './order-management.component';
import { UploadSummaryComponent } from './upload-summary/upload-summary.component';
import { ProducibilityCheckComponent } from './producibility-check/producibility-check.component';
import { StartProductionComponent } from './start-production/start-production.component';

@NgModule({
  imports: [
    OrderManagementRouter,
    TabsModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    OrderManagementComponent,
    NewOrderComponent,
    UploadSummaryComponent,
    ProducibilityCheckComponent,
    StartProductionComponent,
  ]
})
export class OrderManagementModule { }
