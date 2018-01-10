import { Component, HostBinding } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    @HostBinding('class.flat') shouldBeFlat = false;

    constructor(router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.shouldBeFlat = event.url.indexOf('/home') === 0;
            }
        });
    }

}
