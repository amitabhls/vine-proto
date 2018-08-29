import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit, OnDestroy {
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
    private angularFirestore: AngularFirestore,
    private ionicStorage: IonicStorageService,
    private router: Router
  ) {
      this.userID = this.ionicStorage.getUserID();
      if (this.userID) {
          this.observeValueChange = this.angularFirestore.collection('users/').doc<any>(this.userID).valueChanges()
          .subscribe(response => {
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
  }

  ngOnDestroy() {
      if (this.observeValueChange) {
        this.observeValueChange.unsubscribe();
      }
  }

  goToEditProfile(): void {
      this.router.navigateByUrl('/user/edit-profile');
  }

}
