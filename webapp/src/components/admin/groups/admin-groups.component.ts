import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core'
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../../services/admin.service';

@Component({
    selector: 'admin-groups',
    templateUrl: './admin-groups.component.html',
    styleUrls: ['./admin-groups.component.scss']
})
export class AdminGroupsComponent {

    groups;
    userIdToken: string;

    constructor(private http: HttpClient, adminService: AdminService) {
        adminService.userIdToken.subscribe(async userIdToken => {
            this.userIdToken = userIdToken;
            const groups = await http.get(environment.api + 'admin/groups', this.options()).toPromise();
            this.groups = _.sortBy(groups, 'createdAt');
        });
    }

    private static onError(error, message) {
        console.error(error);
        Snackbar.show({text: message, showAction: false, duration: 1500});
    }

    addGroup() {
        this.addGroupAsync().then();
    }

    onDelete(group) {
        this.onDeleteAsync(group).then();
    }

    async onDeleteAsync(group) {
        try {
            const result: any = await this.http.delete(environment.api + 'admin/group/' + group.id, this.options()).toPromise();
            if (result.success) {
                _.remove(this.groups, g => group.id === g.id);
                Snackbar.show({text: `Suppression réussie - ${group.name}`, showAction: false, duration: 1500});
            } else {
                AdminGroupsComponent.onError(result, 'Erreur lors de la suppression.');
            }
        } catch (error) {
            AdminGroupsComponent.onError(error, 'Erreur lors de la suppression.');
        }
    }

    private options() {
        return {
            headers: {
                Authorization: 'Bearer ' + this.userIdToken
            }
        };
    }

    private async addGroupAsync() {
        try {
            const result = await this.http.post(environment.api + 'admin/group', {}, this.options()).toPromise();

            if (!this.groups) this.groups = [];
            this.groups.push(result);
        } catch (error) {
            AdminGroupsComponent.onError(error, 'Cannot create group.');
        }
    }

}
