import { Injectable } from '@angular/core';
import * as stream from 'getstream';
import signing from 'getstream/src/lib/signing';
import { StreamActivity } from '../../../_shared/_models/Model';
import KJUR from 'jsrsasign';
declare let $: any;

const JWT_SIGNING_ALGORITHM = 'HS256';
const APP_TOKEN = 'k6umbw9qu252';
const APP_ID = '40565';
const APP_SECRET = '78cwfzhtsycysckn46afg3nbmrv69gd4mfvqfutfkhneqb2mqztuubrcqceq5ms8';
// const FEED_GROUP = 'User';
// const FEED_ID = 'user-activity';

// const APP_TOKEN = 'ejafvxbtfbz6';
// const APP_ID = '24870';
// const FEED_GROUP = 'conversation';
// const FEED_ID = 'conversation_9876';
// const FEED_TOKEN = 'qkrJTwSrK9-a1ZSmiGVJniWeTtY';

@Injectable()
export class GetstreamService {
  client: stream.Client;
  private Token: string;
  private feedId = '*';
  private userId = '*';
  private readonly jwtHeader = {alg: JWT_SIGNING_ALGORITHM};
  constructor() {
    this.client = stream.connect(APP_TOKEN, null , APP_ID, { location: 'us-east' });
    this.Token = this.getToken();
  }

  getFeed(FEED_GROUP, FEED_ID): Promise<StreamActivity[]> {
    // Instantiate the feed via factory method
    const feed = this.client.feed(FEED_GROUP, FEED_ID, this.getToken());

    // Fetch the feed and pick the results property off the response object
    return feed.get({}).then(response => response['results']);
  }

  getToken(): string {
    let jwtPayload = {
      resource: '*',
      action: '*'
    };

    // Add the optional feed id
    if (this.feedId) {
      jwtPayload['feed_id'] = this.feedId;
    }
    // Add the optional user id
    if (this.userId) {
      jwtPayload['user_id'] = this.userId;
    }
    const sHeader = JSON.stringify(this.jwtHeader);
    const sPayload = JSON.stringify(jwtPayload);

    return KJUR.jws.JWS.sign(
      JWT_SIGNING_ALGORITHM,
      sHeader,
      sPayload,
      APP_SECRET
    );
  }

  addActivity(activity: StreamActivity, FEED_GROUP, FEED_ID): Promise<string> {
    // Instantiate the feed via factory method
    const feed = this.client.feed(FEED_GROUP, FEED_ID, this.getToken());
    const addActivityPromise = feed.addActivity(activity)
      .then(response => response['id']);

    // return the promise resolution
    return Promise.resolve(addActivityPromise);
  }

  updateActivity(activity) {
   // const feed = this.client.feed(FEED_GROUP, FEED_ID, this.Token);
    // console.log(this.client.__proto__,feed);
    // this.client.updateActivities(activity, () => {
    // } );
    this.client.updateActivities(activity, (data) => {
      console.log('update activity', data);
    });
  }

  followUser(whoIsFollowing, whomToFollow) {
      const currentUserFeed = this.client.feed('Timeline', whoIsFollowing, this.getToken());
      currentUserFeed.follow('Timeline', whomToFollow);
  }
}
