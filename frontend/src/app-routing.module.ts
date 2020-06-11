import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

const routes: Routes = [
    { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard]},
    { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)},
    { path: 'signup', loadChildren: () => import('./modules/signup/signup.module').then(m => m.SignupModule)},
    { path: 'error', loadChildren: () => import('./modules/server-error/server-error.module').then(m => m.ServerErrorModule)},
    { path: 'access-denied', loadChildren: () => import('./modules/access-denied/access-denied.module').then(m => m.AccessDeniedModule)},
    { path: 'not-found', loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule)},
    { path: '**', redirectTo: 'not-found' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
