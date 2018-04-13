import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const WITNESSES = [
    {
        firstName: 'Gabrielle',
        lastName: 'Marques',
        picture: '/assets/images/witnesses/gab.jpg'
    },
    {
        firstName: 'Chloé',
        lastName: 'Marion',
        picture: '/assets/images/witnesses/chloe.jpg'
    },
    {
        firstName: 'Jean',
        lastName: 'Dat',
        picture: '/assets/images/witnesses/jean.jpg'
    },
    {
        firstName: 'Ghyslain',
        lastName: 'Bruno',
        picture: '/assets/images/witnesses/ghys.jpg'
    }
];

@Component({
    selector: 'witnesses',
    templateUrl: './witnesses.component.html',
    styleUrls: ['./witnesses.component.scss']
})
export class WitnessesComponent {
    static title = 'Témoins';
    static fragment = 'witnesses';

    witnesses = WITNESSES;

    constructor(private sanitizer: DomSanitizer) {
    }

    sanitize(url) {
        return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
    }
}
