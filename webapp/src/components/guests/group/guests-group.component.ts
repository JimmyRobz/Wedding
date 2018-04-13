import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'guests-group',
    templateUrl: './guests-group.component.html',
    styleUrls: ['./guests-group.component.scss']
})
export class GuestsGroupComponent implements OnInit {

    group;
    groupId: string;

    constructor(private http: HttpClient, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(async params => {
            this.group = undefined;

            this.groupId = params.get('groupId');
            this.group = await this.http.get(environment.api + 'group/' + this.groupId).toPromise();
        });
    }

    async setStatus(guest, status) {
        const oldStatus = guest.status;

        const errorHandler = (error) => {
            console.error(error);

            guest.status = oldStatus;
            Snackbar.show({text: `Erreur lors de l'enregistrement de la réponse.`, showAction: false, duration: 1500});
        };

        guest.status = status;

        try {
            const result: any = await this.http.post(environment.api + 'group/' + this.groupId + '/guest/' + guest.id, {status}).toPromise();
            if (result.success) {
                Snackbar.show({text: `Réponse enregistrée pour ${guest.firstName} ${guest.lastName}`, showAction: false, duration: 1500});
            } else {
                errorHandler(result);
            }
        } catch (error) {
            errorHandler(error);
        }
    }
}
