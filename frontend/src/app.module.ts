import { Injector, NgModule } from "@angular/core";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { SkillCardModule } from "./shared/modules/skill-card/skill-card.module";
import { ServiceLocator } from "./shared/services/service-locator.service";

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SkillCardModule
    ],
    declarations: [
        AppComponent,
    ],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
    // Pass the app service injector to the ServiceLocator so that the locator can be used to find services by plain model classes that cannot use Angular DI
    constructor(private injector: Injector) {
        ServiceLocator.injector = injector;
    }
}
