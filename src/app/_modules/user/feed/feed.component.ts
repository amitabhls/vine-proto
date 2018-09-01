import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserData, Activity } from '../../../_shared/_models/Model';
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
  allUsersData: UserData[];
  testarray: any[] = [];
  imageArray: any[] = [];
  allUserDetails: any;
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
    // this.getFeed();
    // this.extractImageLink();
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
      duration: 6000,
      content: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  // imageLink() {
  //   this.activitiesStoredLocally.forEach(element => {
  //   });
  // }

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

  changeImageLinkInFeed() {
    this.imageArray.length = 0;

    this.angularFirestore.collection(`users/`).valueChanges().subscribe(userData => {
      this.allUsersData = userData;
      for (let i = 0; i < this.activitiesStoredLocally.length; i = i + 1) {
        for (let j = 0; j < this.allUsersData.length; j = j + 1) {
          if (this.activitiesStoredLocally[i].uid === this.allUsersData[j].uid) {
            this.imageArray.push(this.allUsersData[j].photoURL);
            this.testarray.push(this.allUsersData[j].email);
          }
        }
      }
      this.imageArray.reverse();
      this.testarray.reverse();
      console.log('image links', this.imageArray);
      console.log('email links', this.testarray);
      // allFeeds.forEach((element1) => {
      //   allUsersData.forEach(element2 => {
      //     if (element1.uid === element2.uid) {
      //       this.imageArray.push(element2.photoURL);
      //     }
      //   });
      // });
    });

/*

      this.angularFirestore.collection(`users/`).valueChanges().subscribe(userData => {
        let allUsersData = userData;
        for (let i = 0; i < this.activitiesStoredLocally.length; i = i + 1) {
          for (let j = 0; j < allUsersData.length; j = j + 1) {
            if (this.activitiesStoredLocally[i].uid === allUsersData[j].uid) {
              this.imageArray.push(allUsersData[j].photoURL);
              this.testarray.push(allUsersData[j].email);
            }
          }
        }
        // this.imageArray.slice().reverse();
        // this.testarray.slice().reverse();
        // console.log('image links', this.imageArray);
        // console.log('email links', this.testarray);
        // allFeeds.forEach((element1) => {
        //   allUsersData.forEach(element2 => {
        //     if (element1.uid === element2.uid) {
        //       this.imageArray.push(element2.photoURL);
        //     }
        //   });
        // });
      });

      */
  }

  // extractImageLink() {
  //   this.imageLinkArray.length = 0;
  //   this.angularFirestore.collection('users/').valueChanges().subscribe(response => {
  //     this.allUserDetails = response;
  //     console.log('init activities', this.activities);
  //     this.activities.forEach(element1 => {
  //       console.log('inside for 1');
  //       this.allUserDetails.forEach(element2 => {
  //         if (element1.uid === element2.uid) {
  //           this.imageLinkArray.push(element2.photoURL);
  //         }
  //       });
  //     });
  //   });
  // }


  getFeed() {
    {
      this.getAllData = this.angularFirestore.collection('feeds/').valueChanges().subscribe(response => {
        console.log('response response--->', response);
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
        }
      });
    }
  }

  storeDataLocally() {
    setTimeout(() => {
      this.activitiesStoredLocally = this.activities;
      this.changeImageLinkInFeed();
      console.log('local data', this.activitiesStoredLocally);
    }, 6000);
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
      this.imageArray.unshift(newActivity.photoURL);
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
