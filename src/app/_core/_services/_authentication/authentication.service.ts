import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { UserData } from '../../../_shared/_models/Model';
import AuthProvider = firebase.auth.AuthProvider;
import { IonicStorageService } from '../_ionicStorage/ionic-storage.service';
import { Observable } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable()
export class AuthenticationService {
  public token: string;
  public userData: any;
  public user: Observable<firebase.User>;
  public userDetails: any;
  private isGoogleNativeLogin: boolean;

  constructor(
                private angularFireAuth: AngularFireAuth,
                private platform: Platform,
                private ionicStorage: IonicStorageService,
                private loadingController: LoadingController,
                private googlePlus: GooglePlus,
                private alertController: AlertController
             ) {}
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

  loginInWithFacebook() {
    console.log('Login in with facebook');
    return this.webLogin(new firebase.auth.FacebookAuthProvider());
  }

  loginInWithTwitter() {
    console.log('Login in with twitter');
    return this.webLogin(new firebase.auth.TwitterAuthProvider());
  }

  private webLogin(provider: AuthProvider) {
         return this.angularFireAuth.auth.signInWithRedirect(provider)
         .then(() => {
              return this.angularFireAuth.auth.getRedirectResult().then( result => {
                  // this.token = result.credential.accessToken;
                  console.log('Login Result', result);
                  console.log('token xyz', result.credential);
                  this.userData = result.user;
                  console.log('user data xyz', this.userData);
              }).catch(function(error) {
                    console.log('Error->', error);
                    alert(error.message);
              });
          });
    }

    signOut() {
      this.angularFireAuth.auth.signOut();
      this.ionicStorage.removeToken();
      this.ionicStorage.removeUserID();
      this.ionicStorage.removeFromLocalStorage('userData');
      this.isGoogleNativeLogin = JSON.parse(this.ionicStorage.getFromLocalStorage('isGoogleNativeLogin'));
      if (this.isGoogleNativeLogin === true) {
        this.googlePlus.logout();
        this.ionicStorage.removeFromLocalStorage('isGoogleNativeLogin');
      }
    }

    nativeGoogleLogin(): Promise<any> {
      this.ionicStorage.setOnlocalStorage('isGoogleNativeLogin', 'true');
          return this.googlePlus.login({
            'webClientId': '234309026687-peq2gaergggm0fajhrcjslh77hodcdtl.apps.googleusercontent.com',
            // 'offline': true,
            'scopes': 'profile email'
          }).then( response => {
            return this.angularFireAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(response.idToken))
            .then(
              (success: any) => {
                // success
              })
              .catch( error => console.log('Firebase failure: ' + JSON.stringify(error)));
            }).catch(err => console.error('Error: ', err));
      }

    async presentLoading() {
        const loading = await this.loadingController.create({
          spinner: 'hide',
          duration: 3000,
          content: 'Please wait...',
          translucent: true,
          cssClass: 'custom-class custom-loading'
        });
        return await loading.present();
    }

    async presentAlert(msg) {
      const alert = await this.alertController.create({
        header: 'Alert',
        message: msg,
        buttons: ['OK']
      });
      await alert.present();
    }
}

