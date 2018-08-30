import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { StreamActivity, Activity } from '../../../_shared/_models/Model';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FirebaseFeedOperationsService } from '../../../_core/_services/_firebaseFeedOperarions/firebase-feed-operations.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
  activitiesStoredLocally: Activity[];
  sortedActivities;
  getAllData: any;
  userID: string;
  user: any;
  newMessage: string;
  newActivity: Activity;
  loading: boolean;
  activities: any;
  extractDataFromFirestore: any;
  constructor(
    private angularFirestore: AngularFirestore,
    private ionicStorage: IonicStorageService,
    private router: Router,
    private firebaseFeedOperations: FirebaseFeedOperationsService,
    private loadingController: LoadingController
  ) {
    this.initFeedPage();
  }

  ngOnInit() {
    this.presentLoading();
    this.getFeed();
    this.storeDataLocally();
  }

  ngOnDestroy() {
    if (this.extractDataFromFirestore) {
      this.extractDataFromFirestore.unsubscribe();
    }
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

  initFeedPage() {
    this.userID = this.ionicStorage.getUserID();
    console.log('userID', this.userID);
    if (this.userID) {
      this.extractDataFromFirestore = this.angularFirestore.collection(`users/`).doc<any>(this.userID).valueChanges().subscribe(res => {
        this.user = res;
        console.log('user data--==', this.user);
        if (!this.user.isEdited) {
          this.router.navigateByUrl('user/complete-registration');
        }
      });
    }
  }


  getFeed() {
    this.getAllData = this.angularFirestore.collection('feeds/').valueChanges().subscribe(response => {
      this.activities = response;
      for (let i = (this.activities.length - 1); i >= 0; i = i - 1) {
        for (let j = 1; j <= i; j = j + 1) {
          let a = new Date(this.activities[j - 1].time).getTime();
          let b = new Date(this.activities[j].time).getTime();
          if (a > b) {
            let temp = this.activities[j - 1];
            this.activities[j - 1] = this.activities[j];
            this.activities[j] = temp;
          }
        }
        // if (i === 0) {
        //   this.activitiesStoredLocally = this.activities;
        // }
      }
    });
  }


  // getFeed2() {
  //   let activityList;
  //   this.getAllData = this.angularFirestore.collection('feeds/').valueChanges().subscribe(response => {
  //     activityList = response;
  //     for (let i = (activityList.length - 1); i >= 0 ; i = i - 1) {
  //         for (let j = 1; j <= i; j = j + 1) {
  //           let a = new Date(activityList[ j - 1 ].time).getTime();
  //           let b = new Date(activityList[ j ].time).getTime();
  //           if (a > b) {
  //             let temp = activityList[j - 1];
  //             activityList[j - 1] = activityList[j];
  //             activityList[j] = temp;
  //           }
  //         }
  //     }
  //     console.log('before returning', activityList);
  //     return activityList;
  //     });
  // }

  storeDataLocally() {
    setTimeout(() => {
      this.activitiesStoredLocally = this.activities;
      console.log('local data', this.activitiesStoredLocally);
    }, 4000);
  }

  addActivity(): void {
    if (this.user) {
      let newActivity: Activity = {
        uid: this.user.uid,
        actor: this.user.name,
        verb: 'message',
        object: this.newMessage,
        likes: 0,
        time: new Date().toISOString(),
        photoURL: this.user.photoURL
      };
      this.activitiesStoredLocally.push(newActivity);
      this.firebaseFeedOperations.addFeed(newActivity);
      console.log('activity-----', newActivity, this.activitiesStoredLocally);

      this.newMessage = '';
    }

  }

  addLikesToActivity(activity) {
    let likeActivity: number;
    console.log('activity selected', activity);
    likeActivity = activity.likes;
    likeActivity = likeActivity + 1;
    this.activitiesStoredLocally.forEach((element, i) => {
      if (element.id === activity.id) {
        this.activitiesStoredLocally[i].likes = likeActivity;
        this.firebaseFeedOperations.updateLike(activity.id, likeActivity);
      }
    });
  }

  doRefresh(event): void {
    setTimeout(() => {
      this.getFeed();
      event.target.complete();
    }, 2000);
  }

  viewOtherProfile(activity): void {
    console.log('from feed other user', activity.uid);
    if (activity.uid === this.userID) {
      this.router.navigateByUrl('/user/profile');
    } else {
      this.router.navigate(['/user/other-profile'], { queryParams: { otherUsersID: activity.uid } });
    }
  }

}
