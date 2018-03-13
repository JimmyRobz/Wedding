import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../../services/admin.service';

@Component({
    selector: 'admin-guests',
    templateUrl: './admin-guests.component.html',
    styleUrls: ['./admin-guests.component.scss']
})
export class AdminGuestsComponent {

    group;
    groupId: string;

    userIdToken: string;

    constructor(private http: HttpClient, private route: ActivatedRoute, private adminService: AdminService) {
        Observable.combineLatest(adminService.userIdToken, route.paramMap)
            .subscribe(async ([userIdToken, params]) => {
                // User Id Token
                this.userIdToken = userIdToken;

                // Group Id
                this.groupId = params.get('groupId');

                this.group = undefined;
                this.group = await this.http.get(environment.api + 'admin/group/' + this.groupId, this.options()).toPromise();
            });
    }

    private static onError(error, message) {
        console.error(error);
        Snackbar.show({text: message, showAction: false, duration: 1500});
    }

    async setProperty(guest, property: string, value: string) {
        const oldValue = guest[property];

        const errorHandler = (error) => {
            console.error(error);

            guest[property] = oldValue;
            Snackbar.show({text: `Erreur lors de la mise à jour.`, showAction: false, duration: 1500});
        };

        guest[property] = value;

        try {
            const body = {};
            body[property] = value;
            const result: any = await this.http.put(environment.api + 'admin/group/' + this.groupId + '/guest/' + guest.id, body, this.options()).toPromise();
            if (result.success) {
                Snackbar.show({text: `Mise à jour réussie - ${guest.firstName} ${guest.lastName}`, showAction: false, duration: 1500});
            } else {
                errorHandler(result);
            }
        } catch (error) {
            errorHandler(error);
        }

    }

    setStatus(guest, status) {
        this.setProperty(guest, 'status', status).then();
    }

    setAge(guest, age) {
        this.setProperty(guest, 'age', age).then();
    }

    setSex(guest, sex) {
        this.setProperty(guest, 'sex', sex).then();
    }

    async onSave(guest) {
        const errorHandler = (error) => {
            console.error(error);
            Snackbar.show({text: `Erreur lors de la mise à jour.`, showAction: false, duration: 1500});
        };

        try {
            const body = {
                firstName: guest.firstName,
                lastName: guest.lastName
            };
            const result: any = await this.http.put(environment.api + 'admin/group/' + this.groupId + '/guest/' + guest.id, body, this.options()).toPromise();
            if (result.success) {
                Snackbar.show({text: `Mise à jour réussie - ${guest.firstName} ${guest.lastName}`, showAction: false, duration: 1500});
            } else {
                errorHandler(result);
            }
        } catch (error) {
            errorHandler(error);
        }
    }

    async onDelete(guest) {
        try {
            const result: any = await this.http.delete(environment.api + 'admin/group/' + this.groupId + '/guest/' + guest.id, this.options()).toPromise();
            if (result.success) {
                _.remove(this.group.guests, g => guest.id === g.id);
                Snackbar.show({text: `Suppression réussie - ${guest.firstName} ${guest.lastName}`, showAction: false, duration: 1500});
            } else {
                AdminGuestsComponent.onError(result, 'Erreur lors de la mise à jour.');
            }
        } catch (error) {
            AdminGuestsComponent.onError(error, 'Erreur lors de la mise à jour.');
        }
    }

    addGuest() {
        this.addGuestAsync().then()
    }

    onSaveGroupName() {
        this.onSaveGroupNameAsync().then();
    }

    private options() {
        return {
            headers: {
                Authorization: 'Bearer ' + this.userIdToken
            }
        };
    }

    private async addGuestAsync() {
        try {
            const result = await this.http.post(environment.api + 'admin/group/' + this.groupId + '/guests', {}, this.options()).toPromise();

            if (!this.group.guests) this.group.guests = [];
            this.group.guests.push(result);
        } catch (error) {
            AdminGuestsComponent.onError(error, 'Cannot create guest.');
        }
    }

    private async onSaveGroupNameAsync() {
        try {
            const result: any = await this.http.put(environment.api + 'admin/group/' + this.groupId, {
                name: this.group.name
            }, this.options()).toPromise();

            if (result.success) {
                Snackbar.show({text: 'Groupe mis à jour.', showAction: false, duration: 1500});
            } else {
                AdminGuestsComponent.onError(result, 'Mise à jour impossible.');
            }
        } catch (error) {
            AdminGuestsComponent.onError(error, 'Mise à jour impossible.');
        }
    }

}
