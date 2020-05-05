import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

const routes: Routes = [
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: 'login', loadChildren: './modules/login/login.module#LoginModule' },
    { path: 'signup', loadChildren: './modules/signup/signup.module#SignupModule' },
    { path: 'error', loadChildren: './modules/server-error/server-error.module#ServerErrorModule' },
    { path: 'access-denied', loadChildren: './modules/access-denied/access-denied.module#AccessDeniedModule' },
    { path: 'not-found', loadChildren: './modules/not-found/not-found.module#NotFoundModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
