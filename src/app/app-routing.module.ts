import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './_core/_services/_authGuard/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: './_modules/auth/auth.module#AuthModule'},
  { path : 'user', loadChildren: './_modules/user/user.module#UserModule' , canActivate: [AuthGuardService]},
  { path: '**', redirectTo: 'auth', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes , {useHash: true})],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
