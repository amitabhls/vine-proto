import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../_core/_services/_authentication/authentication.service';
import { AngularFirestore } from 'angularfire2/firestore';
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
  public newMessage: string;
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
    if (this.extractDataFromFirestore !== undefined) {
      this.extractDataFromFirestore.unsubscribe();
    }
  }

  initFeedPage() {
    this.userID = this.ionicStorage.getUserID();
    if (this.userID) {
      this.extractDataFromFirestore = this.angularFirestore.collection(`users/`).doc<any>(this.userID).valueChanges().subscribe(res => {
        this.user = res;
        console.log('from feed', this.user);

        this.newActivity = new StreamActivity();
        this.newActivity.actor = this.user.name;
        this.newActivity.verb = 'message';
        this.newActivity.object = this.newMessage;
        this.newActivity.uid = this.user.uid;
        this.newActivity.photoURL = this.user.photoURL;
        this.newActivity.likes = 0;

        if (!this.user.isEdited) {
          this.router.navigateByUrl('user/complete-registration');
        }
      });
    }
  }

  getFeed(): void {
    console.log('[method] getFeed called', this.getstream);
    this.loading = true;
    this.getstream.getFeed('Timeline', this.userData.uid).then(activities => {
      this.activities = activities.filter(function (each) {
        return each.uid;
      });
      this.loading = false;
      console.log('Service promise resolved: ', this.activities);
    });
  }


  // initNewActivity() {
  //   if (this.user) {
  //     this.newActivity = new StreamActivity();
  //     this.newActivity.actor = this.user.name;
  //     this.newActivity.verb = 'message';
  //     this.newActivity.object = this.newMessage;
  //     this.newActivity.uid = this.user.uid;
  //     this.newActivity.photoURL = this.user.photoURL;
  //     this.newActivity.likes = 0;
  //   }
  // }


  addActivity() {
    this.newActivity.object = this.newMessage;
    console.log('[method] addActivity called', this.getstream, this.newActivity);
    this.getstream.addActivity(this.newActivity, 'Timeline', this.user.uid).then(activity_id => {
      console.log('Service promise resolved: ', activity_id);
      this.newActivity.object = '';
      this.getFeed();
    });
  }

  addLikesToActivity(activity) {
    let likeActivity: number;
    likeActivity = activity.likes;
    let updatedActivity: any;
    console.log('Activity Like', activity);
    if (this.alreadyLiked === false) {
      likeActivity = likeActivity + 1;
      activity.likes = likeActivity;
      activity.id = activity.id;
      this.alreadyLiked = true;
    }
    updatedActivity = {
      id: activity.id,
      set: {
        likes: likeActivity
      }
    };
    this.getstream.updateActivity(
      [{
        id: activity.id,
        set: {
          likes: likeActivity
        }
      }]
    );
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
