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
export class AppComponent implements OnInit, OnDestroy {
  appPages = [
    {
      title: 'Feed',
      url: '/user/feed#feed-page',
      icon: 'paper'
    },
    {
      title: 'My Profile',
      url: '/user/profile#user-profile',
      icon: 'person'
    }
  ];

  user: any;
  userAuthState: any;
  checkNewLogin: any;
  allUsers: any;

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
    // window.console.log = function() {};
    this.initializeApp();
    this.checkLoginStatus();
  }

  ngOnDestroy() {
    if (this.userAuthState) {
      this.userAuthState.unsubscribe();
    }
    if (this.checkNewLogin) {
      this.checkNewLogin.unsubscribe();
    }
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
    if (token) {
      console.log('token exist');
      // this.presentLoading(1000);
      // console.log('location', window.location);
      this.router.navigateByUrl('user/feed#feed-page');
    } else {
      console.log('token doesn\'t exist');
      this.checkCurrentAuthStatus();
    }
  }

  checkCurrentAuthStatus(): void {
    this.userAuthState = this.angularFireAuth.authState.subscribe(user => {
      console.log('user-->>', user);
      this.user = user;
      if (user) {
        // this.presentLoading(2000);
        this.ionicStorage.setToken(this.user.qa);
        this.ionicStorage.setUserID(this.user.uid);
        this.checkNewLogin = this.angularFirestore.collection('users/').doc<any>(user.uid).valueChanges().subscribe(response => {
          console.log('response-->', response);
          if (response) {
            this.ionicStorage.setOnlocalStorage('userData', JSON.stringify(response));
            console.log('response app comp');
            if (response.isEdited) {
              console.log('redirected from app comp');
              this.router.navigateByUrl('user/feed#feed-page');
              if (this.checkNewLogin) {
                this.checkNewLogin.unsubscribe();
              }
            } else {
              this.router.navigateByUrl('user/complete-registration#complete-registration');
              // this.followOnGetstream();
              if (this.checkNewLogin) {
                this.checkNewLogin.unsubscribe();
              }
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
            this.router.navigateByUrl('user/complete-registration#complete-registration');
            if (this.checkNewLogin) {
              this.checkNewLogin.unsubscribe();
            }
          }
        });
      } else {
        this.router.navigateByUrl('auth/login#login-page');
      }
    });
  }


  setStorageAndRedirect(): void {
    this.ionicStorage.setToken(this.user.qa);
    this.ionicStorage.setUserID(this.user.uid);
    this.router.navigateByUrl('user/complete-registration#complete-registration');
  }

  // followOnGetstream() {
  //   this.angularFirestore.collection('users/').valueChanges().subscribe(response => {
  //     this.allUsers = response;
  //   });
  //   if (this.allUsers) {
  //     this.allUsers.forEach(element => {
  //       if (this.user.uid !== element.uid) {
  //         this.getStream.followUser(this.user.uid, element.uid);
  //         this.getStream.followUser(element.uid, this.user.uid);
  //       }
  //     });
  //   }
  // }

  async presentLoading(durationInput) {
    const loading = await this.loadingController.create({
      duration: durationInput,
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
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
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
