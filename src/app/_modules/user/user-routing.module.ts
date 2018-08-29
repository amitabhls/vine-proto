import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { AuthGuardService } from '../../_core/_services/_authGuard/auth-guard.service';

const routes: Routes = [
  { path: 'feed', component: FeedComponent , canActivate: [AuthGuardService] },
  { path: 'edit-profile', component: UserProfileComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: UserProfileEditComponent, canActivate: [AuthGuardService] },
  { path: 'other-profile', component: OtherUserProfileComponent, canActivate: [AuthGuardService] },
  { path: 'complete-registration', component: CompleteRegistrationComponent, canActivate: [AuthGuardService]},
  { path: '**', redirectTo: 'feed', pathMatch: 'full'},
  { path: '', redirectTo: 'feed', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class UserRoutingModule { }
