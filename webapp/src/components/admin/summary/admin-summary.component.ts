import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'admin-summary',
    templateUrl: './admin-summary.component.html',
    styleUrls: ['./admin-summary.component.scss']
})
export class AdminSummaryComponent {

    loading: boolean;

    userIdToken: string;
    summary: any;

    constructor(private http: HttpClient, private fireAuth: AngularFireAuth) {
        this.loading = true;

        this.fireAuth.authState.subscribe(async user => {
            this.userIdToken = await user.getIdToken();
            this.summary = await this.getAsAdmin('admin/summary');
            this.loading = false;
        });
    }

    async getAsAdmin(path: string) {
        return await this.http.get(environment.api + path, {
            headers: {
                Authorization: 'Bearer ' + await this.userIdToken
            }
        }).toPromise();
    }

}
