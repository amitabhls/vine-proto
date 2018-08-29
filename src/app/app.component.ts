import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageService } from './_core/_services/_ionicStorage/ionic-storage.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticationService } from './_core/_services/_authentication/authentication.service';
import { GetstreamService } from './_core/_services/_getstream/getstream.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Feed',
      url: '/user/feed',
      icon: 'paper'
    },
    {
      title: 'My Profile',
      url: '/user/profile',
      icon: 'person'
    }
  ];


  public user: any;
  private userAuthState: any;
  private allUsers: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: IonicStorageService,
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private ionicStorage: IonicStorageService,
    private loadingController: LoadingController,
    private router: Router,
    private authentication: AuthenticationService,
    private getStream: GetstreamService,
    private alertController: AlertController,
    private menuController: MenuController
  ) {
  }

  ngOnInit() {
    this.initializeApp();
    this.checkCurrentAuthStatus();
    this.followOnGetstream();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkLoginStatus(): void {
    let token: string;
    token = this.storage.getToken();
    console.log('token from component', token);
    // if (token) {
    //   this.router.navigateByUrl('user');
    // } else {
    //   this.router.navigateByUrl('auth');
    // }
  }

  checkCurrentAuthStatus(): void {
    this.userAuthState = this.angularFireAuth.authState.subscribe(user => {
      console.log('user-->>', user);
      this.user = user;
      if (user) {
        this.ionicStorage.setToken(this.user.qa);
        this.ionicStorage.setUserID(this.user.uid);
        this.angularFirestore.collection('users/').doc<any>(user.uid).valueChanges().subscribe(response => {
          console.log('response-->', response);
          if (response) {
            this.ionicStorage.setOnlocalStorage('userData', JSON.stringify(response));
            console.log('response app comp');
            if (response.isEdited) {
              console.log('redirected from app comp');
              this.router.navigateByUrl('user/feed');
            } else {
              this.router.navigateByUrl('user/complete-registration');
              this.followOnGetstream();
              this.userAuthState.unsubscribe();
            }
          } else {
            this.angularFirestore.collection(`users/`).doc<any>(this.user.uid).set(
              {
                name: user.displayName,
                email: user.email,
                number: user.phoneNumber,
                photoURL: user.photoURL,
                isEdited: false,
                uid: user.uid
              }
            );
            this.router.navigateByUrl('user/complete-registration');
            this.userAuthState.unsubscribe();
          }
        });
      } else {
        this.router.navigateByUrl('auth');
      }
    });
  }

  setStorageAndRedirect(): void {
    this.ionicStorage.setToken(this.user.qa);
    this.ionicStorage.setUserID(this.user.uid);
    this.router.navigateByUrl('user/complete-registration');
  }

  followOnGetstream() {
    this.angularFirestore.collection('users/').valueChanges().subscribe(response => {
      this.allUsers = response;
    });
    if (this.allUsers) {
      this.allUsers.forEach(element => {
        if (this.user.uid !== element.uid) {
          this.getStream.followUser(this.user.uid, element.uid);
          this.getStream.followUser(element.uid, this.user.uid);
        }
      });
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 1000,
      content: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  async presentAlertConfirm() {
    this.menuController.close();
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Do you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });

    await alert.present();
  }

  signOut() {
    console.log('signOut');
    this.authentication.signOut();
  }
}
