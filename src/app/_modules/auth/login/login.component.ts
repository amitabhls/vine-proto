import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { LoadingController } from '@ionic/angular';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  onGoogleLogin() {
    this.authService.loginInWithGoogle();
  }

  onFacebookLogin() {
    this.authService.loginInWithFacebook();
  }

  onTwitterLogin() {
   this.authService.loginInWithTwitter();
  }

  onSignOut() {
   this.authService.signOut();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'lines',
      duration: 2000,
      content: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }


}
