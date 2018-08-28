import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';

const routes: Routes = [
  { path: 'feed', component: FeedComponent },
  { path: 'edit-profile', component: UserProfileComponent },
  { path: 'profile', component: UserProfileEditComponent },
  { path: 'other-profile', component: OtherUserProfileComponent },
  { path: 'complete-registration', component: CompleteRegistrationComponent},
  { path: '**', redirectTo: 'feed', pathMatch: 'full'},
  { path: '', redirectTo: 'feed', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
