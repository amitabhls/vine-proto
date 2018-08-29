import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { AngularFirestore} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { UserData } from '../../../_shared/_models/Model';
import { StreamActivity } from '../../../_shared/_models/Model';
import { IonicStorageService } from '../../../_core/_services/_ionicStorage/ionic-storage.service';
import { Router } from '@angular/router';
import { GetstreamService } from '../../../_core/_services/_getstream/getstream.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
public userID: string;
public userData: any;
public user: any;
private newMessage: string;
public newActivity: StreamActivity;
public loading: boolean;
public alreadyLiked: boolean;
public activities: StreamActivity[] = [];
private extractDataFromFirestore: any;
  constructor(
    private authentication: AuthenticationService,
    private angularFirestore: AngularFirestore,
    private ionicStorage: IonicStorageService,
    private router: Router,
    private getstream: GetstreamService
  ) {
      this.alreadyLiked = false;
    }

  ngOnInit() {
    this.initFeedPage();
    // this.initNewActivity();
    this.getFeed();
  }

  ngOnDestroy() {
    if ( this.extractDataFromFirestore !== undefined ) {
      this.extractDataFromFirestore.unsubscribe();
    }
  }

  initFeedPage() {
    this.userID = this.ionicStorage.getUserID();
    console.log('userID', this.userID);
    if (this.userID) {
      this.extractDataFromFirestore = this.angularFirestore.collection(`users/`).doc<any>(this.userID).valueChanges().subscribe(res => {
        this.user = res;
        console.log('user data--==', this.user);
        if (this.user) {
          this.newActivity = new StreamActivity();
          this.newActivity.actor = this.user.name;
          this.newActivity.verb = 'message';
          this.newActivity.object = this.newMessage;
          this.newActivity.uid = this.user.uid;
          this.newActivity.photoURL = this.user.photoURL;
          this.newActivity.likes = 0;
          this.newActivity.time = new Date().toISOString();
          this.newActivity.foreign_id = this.user.name + ':' + this.user.uid;
          console.log('init Activity', this.newActivity);
        }
        console.log('from feed', this.user);
        if (!this.user.isEdited) {
          this.router.navigateByUrl('user/complete-registration');
        }
      });
    }
  }

  getFeed(): void {
    this.userData = JSON.parse(this.ionicStorage.getFromLocalStorage('userData'));
    console.log('[method] getFeed called', this.getstream);
    this.loading = true;
    this.getstream.getFeed().then(activities => {
      this.activities = activities.filter(function(each) {
        return each.uid;
      });
      this.loading = false;
      console.log('Service promise resolved: ', this.activities);
    });
  }


  addActivity() {
    console.log('userid', this.newMessage);
    console.log('newActivity', this.newActivity);
    this.newActivity.object = this.newMessage;
    console.log('[method] addActivity called', this.getstream);
    console.log('new activity', this.newActivity);
    this.getstream.addActivity(this.newActivity).then(activity_id => {
      console.log('Service promise resolved: ', activity_id);
      this.newActivity.object = '';
      this.getFeed();
    });
  }

  addLikesToActivity(activity) {
    let likeActivity: number;
    likeActivity = activity.likes;
      likeActivity = likeActivity + 1;
      activity.likes = likeActivity;
      this.alreadyLiked = true;
      console.log('Activity after Like update', activity);
      this.getstream.updateActivity([activity]);
  }

  doRefresh(event): void {
    setTimeout(() => {
      this.getFeed();
      event.target.complete();
    }, 2000);
  }

  viewOtherProfile(activity) {
    console.log('from feed other user', activity.uid);
    if (activity.uid === this.userID) {
      this.router.navigateByUrl('/user/profile');
    } else {
      this.router.navigate(['/user/other-profile'], { queryParams: { otherUsersID: activity.uid } });
    }
  }

  signOut() {
    this.authentication.signOut();
  }

}
