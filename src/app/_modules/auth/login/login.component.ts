import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { LoadingController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
  }

  onGoogleLogin() {
    this.authService.loginInWithGoogle();
  }

  onSignOut() {
    this.authService.signOut();
  }
}
