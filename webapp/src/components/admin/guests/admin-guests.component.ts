import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'admin-guests',
    templateUrl: './admin-guests.component.html',
    styleUrls: ['./admin-guests.component.scss']
})
export class AdminGuestsComponent implements OnInit {

    authenticated: boolean;
    loading: boolean;

    constructor(private http: HttpClient, private fireAuth: AngularFireAuth) {
    }

    async ngOnInit() {
        this.loading = true;

        if (!this.fireAuth.auth.currentUser) {
            this.loading = false;
            this.authenticated = false;
            return;
        }

        const data: any = await this.http.get(environment.api + 'admin', {
            headers: {
                Authorization: 'Bearer ' + await this.fireAuth.auth.currentUser.getIdToken()
            }
        }).toPromise();

        if (!data.success) {
            this.loading = true;
            this.authenticated = false;
            return;
        }

        this.loading = false;
        this.authenticated = true;
    }


}
