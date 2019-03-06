import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './layouts';

import { P404Component } from './components/demo-components/error/404.component';
import { P500Component } from './components/demo-components/error/500.component';
import { LoginComponent } from './components/demo-components/login/login.component';
import { RegisterComponent } from './components/demo-components/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'module-management',
        loadChildren: './components/module-management/module-management.module#ModuleManagementModule'
      },
      {
        path: 'order-management',
        loadChildren: './components/order-management/order-management.module#OrderManagementModule'
      },
      {
        path: 'kpi-dashboard',
        loadChildren: './components/kpi-dashboard/kpi-dashboard.module#KpiDashboardModule'
      },
      {
        path: 'base',
        loadChildren: './components/demo-components/base/base.module#BaseModule'
      },
      {
        path: 'buttons',
        loadChildren: './components/demo-components/buttons/buttons.module#ButtonsModule'
      },
      {
        path: 'charts',
        loadChildren: './components/demo-components/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'dashboard',
        loadChildren: './components/demo-components/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'icons',
        loadChildren: './components/demo-components/icons/icons.module#IconsModule'
      },
      {
        path: 'notifications',
        loadChildren: './components/demo-components/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'theme',
        loadChildren: './components/demo-components/theme/theme.module#ThemeModule'
      },
      {
        path: 'widgets',
        loadChildren: './components/demo-components/widgets/widgets.module#WidgetsModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
