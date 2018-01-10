import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'guests',
    templateUrl: './guests.component.html',
    styleUrls: ['./guests.component.scss']
})
export class GuestsComponent {

    static title = 'Invités';
    static fragment = 'guests';

    constructor(private el: ElementRef) {
    }

    get top(): number {
        return this.el.nativeElement.offsetTop;
    }

}
