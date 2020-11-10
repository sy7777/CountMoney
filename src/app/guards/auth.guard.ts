import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { TransmitService } from '../services/transmit.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private service: TransmitService,
    private firebase: FirebaseService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((res, rej) => {
      const user = this.service.getTrans('users');
      if (user instanceof Array) {
        this.router.navigate(['/cashbook']);
        res(false);
      } else {
        this.firebase
          .getUsers(user)
          .get()
          .then((snapshot) => {
            if (snapshot.empty) {
              this.router.navigate(['/cashbook']);
              res(false);
            } else {
              res(true);
            }
          });
      }
    });
  }
}
