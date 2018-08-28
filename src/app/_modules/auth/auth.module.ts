import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from '../../_core/_services/_authentication/authentication.service';
import { SignupComponent } from './signup/signup.component';
import { IonicStorageService } from '../../_core/_services/_ionicStorage/ionic-storage.service';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonicModule.forRoot(),
    FormsModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  providers: [
    AuthenticationService,
    IonicStorageService
  ]
})
export class AuthModule { }
