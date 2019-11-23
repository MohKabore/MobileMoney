import { Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';

export const appRoutes: Routes = [
    { path: 'signIn', component: LoginComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: HomeComponent },
            // { path: 'home', component: HomeComponent, resolve: { user: UserHomeResolver } },
            { path: 'home', component: HomeComponent },
            {path: 'admin', component: AdminPanelComponent, data: {roles: ['Admin', 'Moderator']}}
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
