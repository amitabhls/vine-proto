import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingController, Platform, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  imageArray: any[] = [];
  getAllData: any;
  selectedPhoto: any;
  isPlatformCordova: boolean;
  selectedFiles: FileList;
  updateProfileForm: FormGroup;
  userID: string;
  userData: any;
  oldPhotoURL: any;
  photoURL: any;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  homeAddress: string;
  uid: string;
  observeValueChange: any;
  photoDownloadURL: Observable<string>;

  constructor(
    private formBuilder: FormBuilder,
    private angularFirestore: AngularFirestore,
    private ionicStorage: IonicStorageService,
    private router: Router,
    private platform: Platform,
    private angularFireStorage: AngularFireStorage,
    private loadingController: LoadingController,
    public camera: Camera,
    public actionSheetController: ActionSheetController
  ) {
    if (this.platform.is('cordova')) {
      this.isPlatformCordova = true;
    } else {
      this.isPlatformCordova = false;
    }
  }

  initForm(): void {
    this.updateProfileForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]),
      userPhone: new FormControl('', [Validators.pattern('^(\\+\\d{1,4}[- ]?)?\\d{7,}$')]),
      userLocation: new FormControl('', [Validators.required]),
      userHomeAddress: new FormControl('')
    });
    console.log('init form');
    this.getData();
  }

  getData(): void {
    this.userID = this.ionicStorage.getUserID();
    if (this.userID) {
      this.observeValueChange = this.angularFirestore.collection('users/').doc<any>(this.userID).valueChanges().subscribe(response => {
        this.userData = response;
        console.log('my profile', this.userData);
        this.oldPhotoURL = this.userData.photoURL;
        this.name = this.userData.name;
        this.email = this.userData.email;
        this.phoneNumber = this.userData.phoneNumber;
        this.location = this.userData.location;
        this.homeAddress = this.userData.homeAddress;
        this.uid = this.userData.uid;
        console.log('homeAddress', this.homeAddress);
      });
    }
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    if (this.observeValueChange) {
      this.observeValueChange.unsubscribe();
    }
    if (this.getAllData) {
      this.getAllData.unsubscribe();
    }
  }

  updateDetails(): void {
    if (this.photoDownloadURL) {
      this.photoURL = this.photoDownloadURL;
      // this.changeImageLinkInFeed();
    } else {
      this.photoURL = this.oldPhotoURL;
    }
    const updatedData: object = {
      name: this.updateProfileForm.controls.userName.value,
      email: this.updateProfileForm.controls.userEmail.value,
      phoneNumber: this.updateProfileForm.controls.userPhone.value,
      photoURL: this.photoURL,
      location: this.updateProfileForm.controls.userLocation.value,
      homeAddress: this.updateProfileForm.controls.userHomeAddress.value,
      isEdited: true,
      uid: this.uid
    };
    this.angularFirestore.collection(`users/`).doc(this.userID).set(updatedData);
    this.ionicStorage.setOnlocalStorage('userData', JSON.stringify(updatedData));
    this.router.navigateByUrl('/user/profile#user-profile');
  }

  /*
  changeImageLinkInFeed() {
    this.imageArray.length = 0;
    this.getAllData = this.angularFirestore.collection('feeds/').valueChanges().subscribe(response => {
      let allFeeds = response;
      this.angularFirestore.collection(`users/`).valueChanges().subscribe(userData => {
        let allUsersData = userData;
        allFeeds.forEach((element1) => {
          allUsersData.forEach(element2 => {
            if (element1.uid === element2.uid) {
              this.imageArray.push(element2.photoURL);
            }
          });
        });
      });
    });
  }
*/

  grabImageFromPhone(option: number) {
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: option
    };

    this.camera.getPicture(options).then((imageData) => {
      // this.loading = this.loadingCtrl.create({
      //   content: 'Please wait...'
      // });
      // this.loading.present();
      this.presentLoading(5000);

      this.selectedPhoto = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);

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
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
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
    if (this.selectedFiles.item(0)) {
      this.uploadpic();
    }
  }

  // async presentActionSheet() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Upload Photo',
  //     buttons: [{
  //       text: 'Select from Gallery',
  //       icon: 'albums',
  //       handler: () => {
  //         this.grabImageFromPhone(0);
  //       }
  //     }, {
  //       text: 'Camera',
  //       icon: 'camera',
  //       handler: () => {
  //         this.grabImageFromPhone(1);
  //       }
  //     }]
  //   });
  //   await actionSheet.present();
  // }


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

  async presentLoading(duration: number) {
    const loading = await this.loadingController.create({
      duration: duration,
      content: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
}
