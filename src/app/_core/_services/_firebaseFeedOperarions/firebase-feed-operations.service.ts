import { Injectable , OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Activity } from '../../../_shared/_models/Model';

@Injectable()
export class FirebaseFeedOperationsService implements OnDestroy {

  allActivities: any[] = [];
  getAllData: any;
  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  addFeed(newActivity: Object): void {
    this.angularFirestore.collection(`feeds/`).add(newActivity).then( (docReff) => {
      this.angularFirestore.collection(`feeds/`).doc(docReff.id).set({id: docReff.id}, { merge: true});
     });
  }

  getAllFeeds() {
    this.getAllData = this.angularFirestore.collection('feeds/').valueChanges().subscribe(response => {
       this.allActivities = response;
    });
    return this.allActivities;
  }

  updateLike(docId: string, likeValue: number): void {
    this.angularFirestore.collection('feeds/').doc(docId).set({likes: likeValue}, {merge: true});
  }

  ngOnDestroy() {
    if (this.getAllData) {
      this.getAllData.unsubscribe();
    }
  }
}
