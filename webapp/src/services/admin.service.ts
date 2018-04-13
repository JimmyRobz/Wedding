import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdminService implements CanActivateChild {

    authenticated: Observable<boolean>;
    userIdToken: Observable<string>;

    constructor(private fireAuth: AngularFireAuth, private router: Router) {
        this.authenticated = fireAuth.authState.map(user => !!user);
        this.userIdToken = fireAuth.authState.flatMap(user => {
            if (user) {
                return Observable.fromPromise(user.getIdToken());
            } else {
                return Observable.of(null);
            }
        });
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authenticated.do(authenticated => authenticated || this.redirect(childRoute));
    }

    redirect(route: ActivatedRouteSnapshot) {
        this.router.navigate(['/admin/login'])
            .then(() => {
                console.log("Admin Service - Redirected to login");
            })
            .catch(() => {
                console.log("Admin Service - Cannot redirect to login");
            });
    }

    async signIn(login: string, password: string) {
        await this.fireAuth.auth.signInWithEmailAndPassword(login, password);
    }

    async signOut() {
        await this.fireAuth.auth.signOut();
    }

}
