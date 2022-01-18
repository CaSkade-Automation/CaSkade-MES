import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { MessageContainerComponent } from './components/message-container/message-container.component';
import { MessageComponent } from './components/message/message.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        MessageContainerComponent,
        MessageComponent
    ]
})
export class LayoutModule {}
