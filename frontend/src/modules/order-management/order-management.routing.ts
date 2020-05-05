import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewOrderComponent } from './new-order/new-order.component';
import { OrderManagementComponent } from './order-management.component';
import { UploadSummaryComponent } from './upload-summary/upload-summary.component';
import { CheckResultComponent } from './check-result/check-result.component';

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
        path: 'check-result',
        component: CheckResultComponent,
        data: {
          title: 'Check-Result'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManagementRouter { }
