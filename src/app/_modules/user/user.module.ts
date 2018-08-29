import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { environment } from '../../../environments/environment';

import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireModule } from 'angularfire2';
import { UserRoutingModule } from './user-routing.module';
import { FeedComponent } from './feed/feed.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { AuthenticationService } from '../../_core/_services/_authentication/authentication.service';
import { GetstreamService } from '../../_core/_services/_getstream/getstream.service';
import { FirebaseFeedOperationsService } from '../../_core/_services/_firebaseFeedOperarions/firebase-feed-operations.service';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    IonicModule.forRoot(),
    FormsModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'ionic-4-vine'),
  ],
  declarations: [
    FeedComponent,
    UserProfileComponent,
    UserProfileEditComponent,
    OtherUserProfileComponent,
    CompleteRegistrationComponent
  ],
  providers: [
    AuthenticationService,
    GetstreamService,
    FirebaseFeedOperationsService
  ]
})
export class UserModule { }
