import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserData, Activity } from '../../../_shared/_models/Model';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { FirebaseFeedOperationsService } from '../../../_core/_services/_firebaseFeedOperarions/firebase-feed-operations.service';
import { LinkPreviewService } from '../../../_core/_services/_linkPreview/link-preview-.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {

  isPlatformCordova: boolean;
  linkPreviewResponse: any;
  allUsersData: UserData[] = [];
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
    private sanitizer: DomSanitizer,
    private linkPreview: LinkPreviewService,
    private angularFirestore: AngularFirestore,
    private ionicStorage: IonicStorageService,
    private router: Router,
    private firebaseFeedOperations: FirebaseFeedOperationsService,
    private loadingController: LoadingController,
    private platform: Platform,
    // private youtubePlayer: YoutubeVideoPlayer
  ) {
    if (this.platform.is('cordova')) {
      this.isPlatformCordova = true;
    } else {
      this.isPlatformCordova = false;
    }
    this.initFeedPage();
  }

  ngOnInit() {
    this.presentLoading(4000);
    this.getFeed();
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
    this.imageArray = [];
    this.testarray = [];
    this.allUsersData = [];
    console.log('email array before', this.testarray);
    this.angularFirestore.collection('users/').ref.get().then(
      response => {
        response.forEach(data => {
          this.allUsersData.push(data.data());
        });
        this.activitiesStoredLocally.forEach(activitiesElement => {
          this.allUsersData.forEach(userDataElement => {
            if (activitiesElement.uid === userDataElement.uid) {
              this.imageArray.push(userDataElement.photoURL);
              this.testarray.push(userDataElement.email);
              return true;
            } else {
              return false;
            }
          });
        });
      }
    );
    console.log('email list', this.testarray);
  }

  youtubeNativePlayer(videoId) {
    // this.youtubePlayer.openVideo(videoId);
  }

  getFeed() {
    this.activities = [];
    // this.getAllData;
    const allFeedsRef = this.angularFirestore.collection('feeds/').ref;
    let data = allFeedsRef.orderBy('time', 'desc').get().then(
      responseData => {
        if (!responseData.empty) {
          responseData.forEach(data => {
            this.activities.push(data.data());
          });
        }
        console.log('data from xyz', this.activities);
        this.activitiesStoredLocally = this.activities;
        this.changeImageLinkInFeed();
      });
  }


  addActivity(): void {
    if (this.newMessage) {
      const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      const imageRegex = /(.jpeg|.png|.jpg|.bmp|.gif)/;
      const youtubeRegex = /(www.youtube.com\/watch\?v=)/;
      const mobileYoutubeRegex = /(youtu.be\/)/;
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
          this.presentLoading(2000);
          if (this.newMessage.search(imageRegex) !== -1) {
            this.newActivity = {
              ...this.newActivity,
              isImage: true,
              imageLink: this.newMessage
            };
            this.activitiesStoredLocally.unshift(this.newActivity);
            this.imageArray.unshift(this.newActivity.photoURL);
            this.firebaseFeedOperations.addFeed(this.newActivity);
          } else if (this.newMessage.search(youtubeRegex) !== -1) {
            let message = this.newMessage;
            this.linkPreview.getLinkPreview(this.newMessage).subscribe((response: any) => {
              let video_id = message.split('v=')[1];
              let ampersandPosition = video_id.indexOf('&');
              if (ampersandPosition !== -1) {
                video_id = video_id.substring(0, ampersandPosition);
              }
              let videoEmbedLink = 'https://www.youtube.com/embed/' + video_id;
              this.newActivity = {
                ...this.newActivity,
                isYoutubeLink: true,
                youtubeLinkContent: {
                  videoId: video_id,
                  embedLink: videoEmbedLink,
                  linkPreview: {
                    title: response.title,
                    url: response.url,
                    description: response.description,
                    image: response.image
                  }
                }
              };
              console.log('updated activity', this.newActivity);
              this.activitiesStoredLocally.unshift(this.newActivity);
              this.imageArray.unshift(this.newActivity.photoURL);
              this.firebaseFeedOperations.addFeed(this.newActivity);
            }, (error: any) => {

            });
            /*
            console.log('xyz===>', this.newMessage.search(youtubeRegex));
            let video_id = this.newMessage.split('v=')[1];
            let ampersandPosition = video_id.indexOf('&');
            if (ampersandPosition !== -1) {
              video_id = video_id.substring(0, ampersandPosition);
            }
            let videoEmbedLink = 'https://www.youtube.com/embed/' + video_id;
            this.newActivity = {
              ...this.newActivity,
              isYoutubeLink: true,
              youtubeLink: videoEmbedLink
            };
            this.activitiesStoredLocally.unshift(this.newActivity);
            this.imageArray.unshift(this.newActivity.photoURL);
            this.firebaseFeedOperations.addFeed(this.newActivity);
            */
          } else if (this.newMessage.search(mobileYoutubeRegex) !== -1) {
            let message = this.newMessage;
            this.linkPreview.getLinkPreview(this.newMessage).subscribe((response: any) => {
              let temp = message.indexOf('youtu.be/');
              let video_id = message.substring(temp + 9 );
              let videoEmbedLink = 'https://www.youtube.com/embed/' + video_id;
              this.newActivity = {
                ...this.newActivity,
                isYoutubeLink: true,
                youtubeLinkContent: {
                  videoId: video_id,
                  embedLink: videoEmbedLink,
                  linkPreview: {
                    title: response.title,
                    url: response.url,
                    description: response.description,
                    image: response.image
                  }
                }
              };
              console.log('updated activity', this.newActivity);
              this.activitiesStoredLocally.unshift(this.newActivity);
              this.imageArray.unshift(this.newActivity.photoURL);
              this.firebaseFeedOperations.addFeed(this.newActivity);
            }, (error: any) => {

            });


          } else {
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
              this.activitiesStoredLocally.unshift(this.newActivity);
              this.imageArray.unshift(this.newActivity.photoURL);
              this.firebaseFeedOperations.addFeed(this.newActivity);
            }, (error: any) => {
              console.log('error', error);
            });
          }
        } else {
          this.activitiesStoredLocally.unshift(this.newActivity);
          this.imageArray.unshift(this.newActivity.photoURL);
          this.firebaseFeedOperations.addFeed(this.newActivity);
        }
        console.log('activity-----', this.newActivity, this.activitiesStoredLocally);

        this.newMessage = '';
      }
    }
  }

  domSanitizer(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
      // this.getFeed();
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
