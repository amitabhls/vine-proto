import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import { IonicStorageService } from '../_ionicStorage/ionic-storage.service';

@Injectable()
export class AuthGuardService implements CanActivate { // , CanActivateChild {

  constructor(
    private ionicStorage: IonicStorageService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean {
    console.log('userID', this.ionicStorage.getUserID());
    // console.log('auth guard');
     const userID = this.ionicStorage.getUserID();
     if (userID) {
       return true;
     }
     this.router.navigateByUrl('/auth');
     return false;
  }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean {
  //   return this.canActivate(route, state);
  // }

}
