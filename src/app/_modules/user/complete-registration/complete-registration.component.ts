import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit, OnDestroy {
  isPlatformCordova: boolean;
  selectedPhoto: any;
  completeRegistrationForm: FormGroup;
  user: any;
  name: string;
  phone: string;
  oldPhotoURL: any;
  photoURL: any;
  email: string;
  providerID: string;
  location: string;
  homeAddress: string;
  userID: string;
  selectedFiles: FileList;
  file: File;
  imgsrc;
  progressBarValue;
  photoDownloadURL: Observable<string>;
  uid: string;
  observeValueChange: any;
  userPhoneNumber: string;
  userHomeAddressValue: string;

  constructor(
    private formBuilder: FormBuilder,
    private authentication: AuthenticationService,
    private ionicStorage: IonicStorageService,
    private angularFirestore: AngularFirestore,
    private loadingController: LoadingController,
    private router: Router,
    private angularFireStorage: AngularFireStorage,
    public camera: Camera,
    private alertController: AlertController,
    private platform: Platform
  ) {

    if (this.platform.is('cordova')) {
      this.isPlatformCordova = true;
    } else {
      this.isPlatformCordova = false;
    }
  }

  ngOnInit() {
    this.presentLoading(1000);
    this.initForm();
  }

  ngOnDestroy() {
    if (this.observeValueChange) {
      this.observeValueChange.unsubscribe();
    }
  }

  initForm(): void {
    this.completeRegistrationForm = this.formBuilder.group({
      userName: new FormControl (this.name, [Validators.required]),
      userEmail: new FormControl ('' , [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      userPhone: new FormControl('', [Validators.pattern('^(\\+\\d{1,4}[- ]?)?\\d{7,}$')] ),
      userLocation: new FormControl ('', [Validators.required]),
      userHomeAddress: new FormControl ('')
    });
    console.log('init form');
    this.getData();
  }

  signOut(): void {
    this.authentication.signOut();
  }

  getData(): void {
    this.userID = this.ionicStorage.getUserID();
    if (this.userID) {
      this.observeValueChange = this.angularFirestore.collection(`users/`).doc<any>(this.userID).valueChanges().subscribe(response => {
        if (response) {
          if (response.isEdited) {
            console.log('redirected from complete registration');
            this.router.navigateByUrl('user/feed');
          } else {
            if (response.displayName) {
              this.name = response.displayName;
            }
            if (response.name) {
              this.name = response.name;
            }
            this.user = response;
            this.phone = response.phoneNumber;
            this.oldPhotoURL = response.photoURL;
            this.email = response.email;
            this.uid = response.uid;
          }
        }
      });
    }
    console.log('get data');
  }

  updateDetails(): void {
    if (this.photoDownloadURL) {
      this.photoURL = this.photoDownloadURL;
    } else {
      this.photoURL = this.oldPhotoURL;
    }
    if (!this.completeRegistrationForm.controls.userPhone.value) {
      this.userPhoneNumber = '';
    } else {
      this.userPhoneNumber = this.completeRegistrationForm.controls.userPhone.value;
    }

    if (!this.completeRegistrationForm.controls.userHomeAddress.value) {
      this.userHomeAddressValue = '';
    } else {
      this.userHomeAddressValue = this.completeRegistrationForm.controls.userHomeAddress.value;
    }

    const updatedData: object = {
      name: this.completeRegistrationForm.controls.userName.value,
      email: this.completeRegistrationForm.controls.userEmail.value,
      phoneNumber: this.userPhoneNumber,
      photoURL: this.photoURL,
      location: this.completeRegistrationForm.controls.userLocation.value,
      homeAddress: this.userHomeAddressValue,
      isEdited: true,
      uid: this.uid
    };
    this.angularFirestore.collection(`users/`).doc(this.userID).set(updatedData);
    this.ionicStorage.setOnlocalStorage('userData', JSON.stringify(updatedData));
    console.log('updated');
    console.log('redirected from complete registration 2');
    this.router.navigateByUrl('user/feed');
  }

  async presentLoading(duration: number) {
    const loading = await this.loadingController.create({
      duration: duration,
      content: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  grabImageFromPhone(option: number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: option
    };

    this.camera.getPicture(options).then((imageData) => {
      this.presentLoading(5000);

      this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);

      this.uploadFromPhone();
    }, (err) => {
      console.log('error', err);
    });
  }

  dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }


  uploadFromPhone() {
    if (this.selectedPhoto) {
      const uploadTask = this.angularFireStorage.upload('/userProfilePhotos/' + this.userID, this.selectedPhoto);
      // const uploadTask = firebase.storage().ref().child('/userProfilePhotos/' + this.userID).put(this.selectedPhoto);
      const storageRef = this.angularFireStorage.ref('/userProfilePhotos/' + this.userID);
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(url => {
            this.photoDownloadURL = url;
            console.log(this.photoDownloadURL);
          });
        })
      ).subscribe();
    }
  }


  chooseFiles(event) {
    this.selectedFiles = event.target.files;
    console.log('selected file', this.selectedFiles.item(0));
    if (this.selectedFiles.item(0)) {
      this.uploadpic();
    }
  }

  uploadpic() {
    this.presentLoading(5000);
    const file = this.selectedFiles.item(0);
    const uploadTask = this.angularFireStorage.upload('/userProfilePhotos/' + this.userID, file);
    const storageRef = this.angularFireStorage.ref('/userProfilePhotos/' + this.userID);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(url => {
          this.photoDownloadURL = url;
          console.log(this.photoDownloadURL);
        });
      })
    ).subscribe();
  }

  async presentAlertMultipleButtons(msg) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msg,
      buttons: ['Ok']
    });

    await alert.present();
  }
}
