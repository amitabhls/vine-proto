import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserData, Activity } from '../../../_shared/_models/Model';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FirebaseFeedOperationsService } from '../../../_core/_services/_firebaseFeedOperarions/firebase-feed-operations.service';
import { LinkPreviewService } from '../../../_core/_services/_linkPreview/link-preview-.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
  linkPreviewResponse: any;
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
    private linkPreview: LinkPreviewService,
    private angularFirestore: AngularFirestore,
    private ionicStorage: IonicStorageService,
    private router: Router,
    private firebaseFeedOperations: FirebaseFeedOperationsService,
    private loadingController: LoadingController
  ) {
    this.initFeedPage();
  }

  ngOnInit() {
    this.presentLoading(6000);
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

  async presentLoading(duration) {
    const loading = await this.loadingController.create({
      duration: duration,
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

      /*
      console.log('image links', this.imageArray);
      console.log('email links', this.testarray);
      */

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
    if (this.newMessage) {
      const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      const imageRegex = /(.jpeg|.png|.jpg|.bmp|.gif)/;
      const youtubeRegex = /(www.youtube.com\/watch\?v=)/;
      // const regex = '([A-Z])\w+';
      if (this.user) {
        this.newActivity = {
          uid: this.user.uid,
          actor: this.user.name,
          object: this.newMessage,
          likes: 0,
          time: new Date().toISOString(),
          photoURL: this.user.photoURL,
        };
        if (urlRegex.test(this.newMessage)) {
          this.presentLoading(1000);
          if (this.newMessage.search(imageRegex) !== -1) {
            this.newActivity = {
              ...this.newActivity,
              isImage: true,
              imageLink: this.newMessage
            };
            this.activitiesStoredLocally.push(this.newActivity);
            this.imageArray.unshift(this.newActivity.photoURL);
            this.firebaseFeedOperations.addFeed(this.newActivity);
          }
          // else if (this.newMessage.search(youtubeRegex) !== -1) {
          //   console.log('youtube activated');
          // }
          else {
            // else if (this.newMessage.search(youtubeRegex) !== -1)
            this.linkPreview.getLinkPreview(this.newMessage).subscribe((response: any) => {
              console.log('response', response);
              console.log('object', this.newActivity);
              this.linkPreviewResponse = response;
              this.newActivity = {
                ...this.newActivity,
                isLink: true,
                linkContent: {
                  title: response.title,
                  url: response.url,
                  description: response.description,
                  image: response.image
                }
              };
              console.log('updated activity', this.newActivity);
              this.activitiesStoredLocally.push(this.newActivity);
              this.imageArray.unshift(this.newActivity.photoURL);
              this.firebaseFeedOperations.addFeed(this.newActivity);
              // this.newActivity.isLink = true;
              // this.newActivity.linkContent.title = response.title;
              // this.newActivity.linkContent.description = response.description;
              // this.newActivity.linkContent.url = response.url;
              // this.newActivity.linkContent.image = response.image;
            }, (error: any) => {
              console.log('error', error);
            });
          }
        } else {
          this.activitiesStoredLocally.push(this.newActivity);
          this.imageArray.unshift(this.newActivity.photoURL);
          this.firebaseFeedOperations.addFeed(this.newActivity);
        }
        // const checkIfURL = isUrl(this.newMessage);
        // console.log('new message is url??', checkIfURL);
        /*
        let newActivity: Activity = {
          uid: this.user.uid,
          actor: this.user.name,
          verb: 'message',
          object: this.newMessage,
          likes: 0,
          time: new Date().toISOString(),
          photoURL: this.user.photoURL
        };
        */


        //  this.newActivity = {
        //   uid: this.user.uid,
        //   actor: this.user.name,
        //   verb: 'link',
        //   object: this.newMessage,
        //   likes: 0,
        //   time: new Date().toISOString(),
        //   photoURL: this.user.photoURL,
        //   isLink: true,
        //   linkContent: {
        //     title: this.linkPreviewResponse.title,
        //     url: this.linkPreviewResponse.url,
        //     description: this.linkPreviewResponse.description,
        //     image: this.linkPreviewResponse.image
        //   }
        // };

        // this.activitiesStoredLocally.push(this.newActivity);
        // this.imageArray.unshift(this.newActivity.photoURL);
        // this.firebaseFeedOperations.addFeed(this.newActivity);

        console.log('activity-----', this.newActivity, this.activitiesStoredLocally);

        this.newMessage = '';
      }
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
