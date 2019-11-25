import { Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

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
            {path: 'admin', component: AdminPanelComponent, data: {roles: ['Admin', 'Moderator']}},
            {path: 'list', component: TransactionListComponent, data: {roles: ['Admin', 'Moderator','Operator']}}
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
