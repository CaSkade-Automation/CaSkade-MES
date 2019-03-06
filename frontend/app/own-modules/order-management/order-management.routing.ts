import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewOrderComponent } from './new-order/new-order.component';
import { OrderManagementComponent } from './order-management.component';
import { UploadSummaryComponent } from './upload-summary/upload-summary.component';
import { ProducibilityCheckComponent } from './producibility-check/producibility-check.component';
import { StartProductionComponent } from './start-production/start-production.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'new-order',
    pathMatch: 'full',
  },
  {
    path: '',
    component: OrderManagementComponent,
    data: {
      title: 'OrderManagement'
    },
    children: [
      {
        path: 'new-order',
        component: NewOrderComponent,
        data: {
          title: 'New Order'
        }
      },
      {
        path: 'upload-summary',
        component: UploadSummaryComponent,
        data: {
          title: 'Order Summary'
        }
      },
      {
        path: 'producibility-check',
        component: ProducibilityCheckComponent,
        data: {
          title: 'Check Production'
        }
      },
      {
        path: 'start-production',
        component: StartProductionComponent,
        data: {
          title: 'Start Production'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManagementRouter { }
