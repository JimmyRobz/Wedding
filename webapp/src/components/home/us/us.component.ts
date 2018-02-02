import { Component } from '@angular/core';

@Component({
    selector: 'us',
    templateUrl: './us.component.html',
    styleUrls: ['./us.component.scss']
})
export class UsComponent {

    static title = 'Nous';
    static fragment = 'us';
    static active = false;

    constructor() {
    }
}
