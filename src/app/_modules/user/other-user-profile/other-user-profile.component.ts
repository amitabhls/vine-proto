import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { GetstreamService } from '../../../_core/_services/_getstream/getstream.service';
import { StreamActivity } from '../../../_shared/_models/Model';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';

@Component({
  selector: 'app-other-user-profile',
  templateUrl: './other-user-profile.component.html',
  styleUrls: ['./other-user-profile.component.scss']
})
export class OtherUserProfileComponent implements OnInit, AfterViewInit {
public otherUsersID: string;
public name: string;
public email: string;
public phoneNumber: string;
public location: string;
public homeAddress: string;
public photoURL: string;
public loading: boolean;
public userID: string;
public activities: StreamActivity[] = [];
public selectedFeeds: any[] = [];
public loggedInUserPhotoURL: string;
public loggedInUserName: string;
  constructor(
    private route: ActivatedRoute,
    private angularFirestore: AngularFirestore,
    private getstream: GetstreamService,
    private ionicStorage: IonicStorageService
  ) {
      this.route.queryParams.subscribe( params => {
          this.otherUsersID = params['otherUsersID'];
      });
      this.userID = this.ionicStorage.getUserID();
      if (this.userID) {
            this.angularFirestore.collection('users/').doc<any>(this.userID).valueChanges().subscribe(response => {
            this.loggedInUserPhotoURL = response.photoURL;
            this.loggedInUserName = response.name;
        });
      }
    }

  ngOnInit() {
      this.getUserData();
      this.getFeed();
      console.log('all activity of' + this.otherUsersID , this.activities);
  }

  ngAfterViewInit() {
    console.log(' activities of xyz', this.activities);
  }

  getUserData(): void {
    if (this.otherUsersID) {
      this.angularFirestore.collection('users/').doc<any>(this.otherUsersID).valueChanges().subscribe(response => {
        console.log('other user ', response);
        this.name = response.name;
        this.email = response.email;
        this.phoneNumber = response.phoneNumber;
        this.location = response.location;
        this.homeAddress = response.homeAddress;
        this.photoURL = response.photoURL;
      });
    }
  }

  getFeed() {
    this.selectedFeeds.length = 0;
    console.log('other user from getfeed', this.otherUsersID);
      this.userID = this.ionicStorage.getUserID();
      console.log('user id--->', this.userID);
      this.loading = true;
      this.getstream.getFeed().then(activities => {
          this.activities = activities;
          console.log('get ffrrr', activities);
          this.activities.forEach((element, i) => {
            if (element.uid === this.otherUsersID) {
              this.selectedFeeds.push(element);
            }
          });
          // this.activities = activities.filter(function(each) {
          //   return each.uid === this.otherUsersID;
          // });
          this.loading = false;
          console.log('all act', this.selectedFeeds);
      });
  }
}
