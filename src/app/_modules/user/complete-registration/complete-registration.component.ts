import { Component, OnInit } from '@angular/core';
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
export class CompleteRegistrationComponent implements OnInit {
  public completeRegistrationForm: FormGroup;
  public user: any;
  public name: string;
  public phone: string;
  public oldPhotoURL: any;
  public photoURL: any;
  public email: string;
  public providerID: string;
  public location: string;
  public homeAddress: string;
  public userID: string;
  public selectedFiles: FileList;
  public file: File;
  public imgsrc;
  public progressBarValue;
  public photoDownloadURL: Observable<string>;

  private uid: string;

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
    this.initForm();
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
      this.angularFirestore.collection(`users/`).doc<any>(this.userID).valueChanges().subscribe(response => {
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
    const updatedData: object = {
      name: this.completeRegistrationForm.controls.userName.value,
      email: this.completeRegistrationForm.controls.userEmail.value,
      phoneNumber: this.completeRegistrationForm.controls.userPhone.value,
      photoURL: this.photoURL,
      location: this.completeRegistrationForm.controls.userLocation.value,
      homeAddress: this.completeRegistrationForm.controls.userHomeAddress.value,
      isEdited: true,
      uid: this.uid
    };
    this.angularFirestore.collection(`users/`).doc(this.userID).set(updatedData);
    this.ionicStorage.setOnlocalStorage('userData', JSON.stringify(updatedData));
    console.log('updated');
    console.log('redirected from complete registration 2');
    this.router.navigateByUrl('user/feed');
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'hide',
      duration: 2000,
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
