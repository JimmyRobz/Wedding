import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss']
})
export class EventsComponent {

    static title = 'Programme';
    static fragment = 'events';

    constructor(private el: ElementRef) {
    }

    get top(): number {
        return this.el.nativeElement.offsetTop;
    }
}
