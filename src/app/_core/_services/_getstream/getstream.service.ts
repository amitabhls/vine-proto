import { Injectable } from '@angular/core';
import * as stream from 'getstream';
import { StreamActivity } from '../../../_shared/_models/Model';
import KJUR from 'jsrsasign';
declare let $: any;

const JWT_SIGNING_ALGORITHM = 'HS256';
const APP_TOKEN = 'k6umbw9qu252';
const APP_ID = '40565';
const APP_SECRET = '78cwfzhtsycysckn46afg3nbmrv69gd4mfvqfutfkhneqb2mqztuubrcqceq5ms8';
const FEED_GROUP = 'Timeline';
const FEED_ID = 'user-activity';

@Injectable()
export class GetstreamService {
  client: stream.Client;
  Token: string;
  feedId = '*';
  userId = '*';
  private readonly jwtHeader = {alg: JWT_SIGNING_ALGORITHM};
  constructor() {
    this.client = stream.connect(APP_TOKEN, null , APP_ID, { location: 'us-east' });
    this.Token = this.getToken();
  }

  getFeed(): Promise<StreamActivity[]> {
    const feed = this.client.feed(FEED_GROUP, FEED_ID, this.getToken());

    return feed.get({}).then(response => response['results']);
  }

  getToken(): string {
    let jwtPayload = {
      resource: '*',
      action: '*'
    };

    if (this.feedId) {
      jwtPayload['feed_id'] = this.feedId;
    }
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

  addActivity(activity: StreamActivity): Promise<string> {
    const feed = this.client.feed(FEED_GROUP, FEED_ID, this.getToken());
    const addActivityPromise = feed.addActivity(activity)
      .then(response => response['id']);

    return Promise.resolve(addActivityPromise);
  }

  updateActivity(activity): void {
    console.log('activity from service', activity);
    this.client.updateActivities(activity, function(res) {
      console.log('res:', res );
    });
  }

  followUser(whoIsFollowing, whomToFollow): void {
      const currentUserFeed = this.client.feed('Timeline', whoIsFollowing, this.getToken());
      currentUserFeed.follow('Timeline', whomToFollow);
  }
}
