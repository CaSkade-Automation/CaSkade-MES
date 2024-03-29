// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';


// Routing
import { OrderManagementRouter } from './order-management.routing';

// Components
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderManagementComponent } from './order-management.component';
import { UploadSummaryComponent } from './upload-summary/upload-summary.component';
import { CheckResultComponent } from './check-result/check-result.component';
import { OrderQueryService } from './order-query-service';

@NgModule({
    imports: [
        OrderManagementRouter,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        HttpClientModule
    ],
    declarations: [
        OrderManagementComponent,
        NewOrderComponent,
        UploadSummaryComponent,
        CheckResultComponent,
    ],
    providers: [
        OrderQueryService
    ]
})
export class OrderManagementModule { }
