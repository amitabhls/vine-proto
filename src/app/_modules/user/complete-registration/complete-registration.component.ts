import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit, OnDestroy {
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
    private angularFireStorage: AngularFireStorage
  ) {
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
      userEmail: new FormControl ('' || this.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      userPhone: new FormControl ('' || this.phone),
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

  chooseFiles(event) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0)) {
      this.uploadpic();
    }
  }

  uploadpic() {
    this.presentLoading(3000);
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
}
