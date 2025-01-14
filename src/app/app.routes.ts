import { AUTHENTICATION_PATHS, ROOT_PATHS } from '~core/constants/paths.constants';
import { Error404Component } from '~core/components/error-404/error-404.component';
import type { Route } from '@angular/router';
import { HomeComponent } from '~features/home/home.component';
import { authenticationGuard } from '~core/guards/authentication.guard';
import { MessagesPageComponent } from '~features/dashboard/dashboard.component';

export const appRoutes: Route[] = [
  {
    path: ROOT_PATHS.home,
    component: HomeComponent,
  },
  {
    path: ROOT_PATHS.messages,
    component: MessagesPageComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: AUTHENTICATION_PATHS.base,
    loadChildren: async () =>
      import('./features/authentication/authentication.routes').then(
        (module_) => module_.AUTHENTICATION_ROUTES,
      ),
  },
  { path: '404', component: Error404Component },
  { path: '**', redirectTo: '404' },
];
