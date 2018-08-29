import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private userID: string;
  private userData: any;
  public photoURL: string;
  public name: string;
  public email: string;
  public phoneNumber: string;
  public location: string;
  public homeAddress: string;
  public uid: string;

  constructor(
    private angularFirestore: AngularFirestore,
    private ionicStorage: IonicStorageService
  ) {
    this.userID = this.ionicStorage.getUserID();
    if (this.userID) {
        this.angularFirestore.collection('users/').doc<any>(this.userID).valueChanges().subscribe(response => {
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

  updateDetails(): void {
    let updatedData: object = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      photoURL: this.photoURL,
      location: this.location,
      homeAddress: this.homeAddress,
      isEdited: true,
      uid: this.uid
    };
    this.angularFirestore.collection(`users/`).doc(this.userID).set(updatedData);
    this.ionicStorage.setOnlocalStorage('userData', JSON.stringify(updatedData));
  }
}
