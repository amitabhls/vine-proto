import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import { Upload } from '../../../_shared/_models/Model';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
public user: any;
public name: string;
public phone: string;
public photoURL: string;
public email: string;
public providerID: string;
public location: string;
public homeAddress: string;
public userID: string;
private basePath: string;
private uploadTask: firebase.storage.UploadTask;
private ref: any;
private task: any;
private uploadProgress: any;
private downloadURL: string;
private uid: string;
selectedFiles: FileList;
currentUpload: Upload;

  constructor(
    private authentication: AuthenticationService,
    private ionicStorage: IonicStorageService,
    private angularFirestore: AngularFirestore,
    private loadingController: LoadingController,
    private router: Router,
    private angularFireStorage: AngularFireStorage
  ) {
      this.basePath  = '/ProfilePhotos-Vine';
    }

  ngOnInit() {
    this.getData();
  }

  signOut() {
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
            this.photoURL = response.photoURL;
            this.email = response.email;
            this.uid = response.uid;
            }
          }
      });
    }
  }

  updateDetails(): void {
    this.angularFirestore.collection(`users/`).doc(this.userID).set(
      {
        name: this.name,
        email: this.email,
        phoneNumber: this.phone,
        photoURL: this.photoURL,
        location: this.location,
        homeAddress: this.homeAddress,
        isEdited: true,
        uid: this.uid

      }
    );
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
/*
  uploadImage(upload: Upload) {
    // const randomId = Math.random().toString(36).substring(2);
    // this.ref = this.angularFireStorage.ref(randomId);
    // this.task = this.ref.put(event.target.files[0]);
    // this.uploadProgress = this.task.percentageChanges();
    // console.log('progress', this.uploadProgress);
    // this.downloadURL = this.task.downloadURL();
    // console.log(this.downloadURL);

    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${this.userID}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(upload.progress);
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL;
        upload.name = upload.file.name;

  }
);
}
uploadSingle() {
  let file = this.selectedFiles.item(0);
  this.currentUpload = new Upload(file);
  this.uploadImage(this.currentUpload);
}
*/
}
