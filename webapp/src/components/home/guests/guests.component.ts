import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'guests',
    templateUrl: './guests.component.html',
    styleUrls: ['./guests.component.scss']
})
export class GuestsComponent {

    static title = 'Invités';
    static fragment = 'guests';
    static active = false;

    constructor(private el: ElementRef) {
    }

    get top(): number {
        return this.el.nativeElement.offsetTop;
    }

}
