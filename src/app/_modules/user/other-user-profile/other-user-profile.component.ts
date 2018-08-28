import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { GetstreamService } from '../../../_core/_services/_getstream/getstream.service';
import { StreamActivity } from '../../../_shared/_models/Model';

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
public activities: StreamActivity[] = [];
  constructor(
    private route: ActivatedRoute,
    private angularFirestore: AngularFirestore,
    private getstream: GetstreamService
  ) {
      this.route.queryParams.subscribe( params => {
          this.otherUsersID = params['otherUsersID'];
      });
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

  getFeed(): void {
      this.loading = true;
      this.getstream.getFeed('Timeline', this.otherUsersID ).then(activities => {
          this.activities = activities.filter(function(each) {
                return each.uid  === this.otherUsersID;
          });
          this.loading = false;
      });
  }

}
