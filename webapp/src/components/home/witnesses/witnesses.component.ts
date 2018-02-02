import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const WITNESSES = [
    {
        firstName: 'Gabrielle',
        lastName: 'Marques',
        picture: 'https://picsum.photos/180/181'
    },
    {
        firstName: 'Chloé',
        lastName: 'Marion',
        picture: 'https://picsum.photos/180/182'
    },
    {
        firstName: 'Jean',
        lastName: 'Dat',
        picture: 'https://picsum.photos/180/183'
    },
    {
        firstName: 'Ghyslain',
        lastName: 'Bruno',
        picture: 'https://picsum.photos/180/184'
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
