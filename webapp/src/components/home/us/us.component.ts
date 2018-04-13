import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'us',
    templateUrl: './us.component.html',
    styleUrls: ['./us.component.scss']
})
export class UsComponent {

    static title = 'Nous';
    static fragment = 'us';

    us: [
        {
            firstName: 'Ophélie',
            lastName: 'Laup',
            picture: 'https://picsum.photos/120/120',
            description: 'Lorem ipsum'
        },
        {
            firstName: 'Jimmy',
            lastName: 'Robert',
            picture: 'https://picsum.photos/120/121',
            description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum'
        }
        ];

    constructor(private sanitizer: DomSanitizer) {
    }

    sanitize(url) {
        return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
    }
}
