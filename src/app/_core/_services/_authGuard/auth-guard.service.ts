import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { IonicStorageService } from '../_ionicStorage/ionic-storage.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private ionicStorage: IonicStorageService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean {
    console.log('userID', this.ionicStorage.getUserID());
     const userID = this.ionicStorage.getUserID();
     if (userID) {
       return true;
     }
     this.router.navigateByUrl('/auth');
     return false;
  }

}
