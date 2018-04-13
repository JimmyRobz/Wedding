import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss']
})
export class EventsComponent {

    static title = 'Programme';
    static fragment = 'events';

    events = [
        {
            picture: '/assets/images/ceremony.png',
            title: 'La cérémonie religieuse',
            date: 'Vendredi, 12 Octobre 2018',
            time: '14h - 15h',
            address: 'Église Notre Dame de la Paix - Saint-Gilles-les-Bains',
            mapsLink: 'https://www.google.fr/maps/place/Paroisse+Notre-Dame-de-la-Paix/@-21.0559973,55.2246397,245m/data=!3m2!1e3!4b1!4m5!3m4!1s0x2182921e0f4e2065:0x869bdded5a9e0e49!8m2!3d-21.0559973!4d55.2251869'
        },
        {
            picture: '/assets/images/party.jpg',
            title: 'La soirée',
            date: 'Vendredi, 12 Octobre 2018',
            time: '18h - 4h',
            address: 'Golf du Bassin Bleu - Saint-Gilles-Les-Hauts',
            mapsLink: 'https://www.google.fr/maps/place/Golf+du+Bassin+Bleu/@-21.0534445,55.2517739,17z/data=!4m12!1m6!3m5!1s0x218291da60ce920b:0xbac58f7536eeb5d4!2sGolf+du+Bassin+Bleu!8m2!3d-21.0534445!4d55.2539626!3m4!1s0x218291da60ce920b:0xbac58f7536eeb5d4!8m2!3d-21.0534445!4d55.2539626'
        }
    ];

    constructor(private sanitizer: DomSanitizer) {
    }

    sanitize(url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
}
