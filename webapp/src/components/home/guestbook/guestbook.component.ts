import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'guestbook',
    templateUrl: './guestbook.component.html',
    styleUrls: ['./guestbook.component.scss']
})
export class GuestbookComponent {

    static title = 'Livre d\'or';
    static fragment = 'guestbook';

    constructor(private el: ElementRef) {
    }

    get top(): number {
        return this.el.nativeElement.offsetTop;
    }

}
