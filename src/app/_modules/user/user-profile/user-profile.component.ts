import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  updateProfileForm: FormGroup;
  userID: string;
  userData: any;
  photoURL: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  homeAddress: string;
  uid: string;
  observeValueChange: any;

  constructor(
    private formBuilder: FormBuilder,
    private angularFirestore: AngularFirestore,
    private ionicStorage: IonicStorageService,
    private router: Router
  ) { }

  initForm(): void {
    this.updateProfileForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      userPhone: new FormControl(''),
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
        this.photoURL = this.userData.photoURL;
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
  }

  updateDetails(): void {
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
    console.log('name', this.updateProfileForm.controls.userName.value);
    console.log('email', this.updateProfileForm.controls.userEmail.value);
    console.log('phone number', this.updateProfileForm.controls.userPhone.value);
    console.log('photo url',  this.photoURL);
    console.log('location', this.updateProfileForm.controls.userLocation.value);
    console.log('home address', this.updateProfileForm.controls.userHomeAddress.value);
    console.log('isEdited', true);
    console.log('uid', this.uid);

    this.angularFirestore.collection(`users/`).doc(this.userID).set(updatedData);
    this.ionicStorage.setOnlocalStorage('userData', JSON.stringify(updatedData));
    this.router.navigateByUrl('/user/profile');
  }
}
