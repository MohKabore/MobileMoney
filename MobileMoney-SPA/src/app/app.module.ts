import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { StepperModule, ToastModule, WavesModule } from 'ng-uikit-pro-standard';

import { appRoutes } from './routes';
import { AuthGuard } from './_guards/auth.guard';
import { registerLocaleData, CommonModule } from '@angular/common';
import fr from '@angular/common/locales/fr';
registerLocaleData(fr);
import localeFr from '@angular/common/locales/fr';
import { AlertifyService } from './_services/alertify.service';
import { NavAdminComponent } from 'src/nav/nav-admin/nav-admin.component';
import { TransactionService } from './_services/transction.service';


// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');

export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      LoginComponent,
      NavAdminComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      // AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      StepperModule,
      WavesModule,
      RouterModule.forRoot(appRoutes),
      ToastModule.forRoot(), MDBBootstrapModulesPro.forRoot(),

      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      })
   ],
   providers: [
      MDBSpinningPreloader,
      AlertifyService,
      TransactionService,
      AuthGuard
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
