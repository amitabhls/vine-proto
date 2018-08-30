import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { GetstreamService } from '../../../_core/_services/_getstream/getstream.service';
import { StreamActivity } from '../../../_shared/_models/Model';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-other-user-profile',
  templateUrl: './other-user-profile.component.html',
  styleUrls: ['./other-user-profile.component.scss']
})
export class OtherUserProfileComponent implements OnInit, OnDestroy {
  getAllData: any;
  otherUsersID: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  homeAddress: string;
  photoURL: string;
  loading: boolean;
  userID: string;
  activities: any[] = [];
  selectedFeeds: any[] = [];
  loggedInUserPhotoURL: string;
  loggedInUserName: string;
  observeValueChange: any;
  observeValueChange2: any;
  constructor(
    private route: ActivatedRoute,
    private angularFirestore: AngularFirestore,
    private getstream: GetstreamService,
    private ionicStorage: IonicStorageService,
    private loadingController: LoadingController
  ) {
    this.route.queryParams.subscribe(params => {
      this.otherUsersID = params['otherUsersID'];
    });
    this.userID = this.ionicStorage.getUserID();
    if (this.userID) {
      this.observeValueChange = this.angularFirestore.collection('users/').doc<any>(this.userID).valueChanges()
        .subscribe(response => {
          this.loggedInUserPhotoURL = response.photoURL;
          this.loggedInUserName = response.name;
        });
    }
  }

  ngOnInit() {
    this.presentLoading();
    this.getUserData();
    this.getFeed();
    console.log('all activity of' + this.otherUsersID, this.activities);
  }

  ngOnDestroy() {
    if (this.observeValueChange) {
      this.observeValueChange.unsubscribe();
    }
    if (this.observeValueChange2) {
      this.observeValueChange2.unsubscribe();
    }
  }

  getUserData(): void {
    if (this.otherUsersID) {
      this.observeValueChange2 = this.angularFirestore.collection('users/').doc<any>(this.otherUsersID).valueChanges()
      .subscribe(response => {
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

  getFeed(): void {
    this.selectedFeeds.length = 0;
    this.getAllData = this.angularFirestore.collection('feeds/').valueChanges().subscribe(response => {
      this.activities = response;
      this.activities.forEach(element => {
        if (element.uid === this.otherUsersID) {
          this.selectedFeeds.push(element);
        }
        for (let i = (this.selectedFeeds.length - 1); i >= 0 ; i = i - 1) {
          for (let j = 1; j <= i; j = j + 1) {
            let a = new Date(this.selectedFeeds[ j - 1 ].time).getTime();
            let b = new Date(this.selectedFeeds[ j ].time).getTime();
            if (a > b) {
              let temp = this.selectedFeeds[j - 1];
              this.selectedFeeds[j - 1] = this.selectedFeeds[j];
              this.selectedFeeds[j] = temp;
            }
          }
      }
      });
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 1000,
      content: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
}
