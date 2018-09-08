import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { LoadingController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loader: boolean;
  loginInit: boolean;
  constructor(
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) {
    console.log('loader in construtor before', this.loader);
    this.loader = false;
    console.log('loader in construtor after', this.loader);
  }

  ngOnInit() {

    // console.log('local storage', JSON.parse(localStorage.getItem('loginInit')));
    // const statusInStorage = JSON.parse(localStorage.getItem('loginInit'));
    // if ( statusInStorage === 'true') {
    //   this.loginInit = true;
    // } else if (statusInStorage === 'false') {
    //   this.loginInit = false;
    // }
    // console.log('loader on init', this.loader);
    // console.log('loader on init logInit', this.loginInit);
  }

  onGoogleLogin() {
    this.loader = true;
    this.presentLoading(2000);
    this.authService.loginInWithGoogle();
  }

  onSignOut() {
    this.authService.signOut();
  }

  async presentLoading(durationInput) {
    const loading = await this.loadingController.create({
      duration: durationInput,
      content: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
}
