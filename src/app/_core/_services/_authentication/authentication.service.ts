import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from '@ionic/angular';
import AuthProvider = firebase.auth.AuthProvider;
import { IonicStorageService } from '../_ionicStorage/ionic-storage.service';
import { Observable } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {
  token: string;
  userData: any;
  user: Observable<firebase.User>;
  userDetails: any;
  isGoogleNativeLogin: boolean;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private platform: Platform,
    private ionicStorage: IonicStorageService,
    private googlePlus: GooglePlus,
    private router: Router
  ) { }
  /**
   * @name loginInWithGoogle
   * @type Promise<any>
   * @description     This function is used for signing in with Google.
   */
  loginInWithGoogle() {
    if (this.platform.is('cordova')) {
      return this.nativeGoogleLogin();
    } else {
      return this.webLogin(new firebase.auth.GoogleAuthProvider());
    }
  }

  private webLogin(provider: AuthProvider) {
    return this.angularFireAuth.auth.signInWithRedirect(provider)
      .then(() => {
        return this.angularFireAuth.auth.getRedirectResult().then(result => {
          console.log('Login Result', result);
          console.log('token xyz', result.credential);
          this.userData = result.user;
          console.log('user data xyz', this.userData);
        }).catch(function (error) {
          console.log('Error->', error);
          alert(error.message);
        });
      });
  }

  nativeGoogleLogin(): Promise<any> {
    this.ionicStorage.setOnlocalStorage('isGoogleNativeLogin', 'true');
    return this.googlePlus.login({
      'webClientId': '234309026687-peq2gaergggm0fajhrcjslh77hodcdtl.apps.googleusercontent.com',
      'scopes': 'profile email'
    }).then(response => {
      return this.angularFireAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(response.idToken))
        .then(
          (success: any) => {
            console.log('Success:', success);
          })
        .catch(error => console.log('Firebase failure: ' + JSON.stringify(error)));
    }).catch(err => console.error('Error: ', err));
  }

  signOut(): void {
    this.angularFireAuth.auth.signOut();
    this.ionicStorage.removeToken();
    this.ionicStorage.removeUserID();
    this.ionicStorage.removeFromLocalStorage('userData');
    this.isGoogleNativeLogin = JSON.parse(this.ionicStorage.getFromLocalStorage('isGoogleNativeLogin'));
    if (this.isGoogleNativeLogin === true) {
      this.googlePlus.logout();
      this.ionicStorage.removeFromLocalStorage('isGoogleNativeLogin');
    }
    this.router.navigateByUrl('/auth');
  }
}

