import { Component } from '@angular/core'
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
    selector: 'admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {

    constructor(private adminService: AdminService, private router: Router) {
    }

    onDisconnect() {
        this.adminService.signOut()
            .then(() => {
                return this.router.navigate(['/'])
            })
            .then(() => {
                console.log('Redirected to home screen after disconnect.')
            });
    }

}
