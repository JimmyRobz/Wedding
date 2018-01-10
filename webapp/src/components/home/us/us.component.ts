import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'us',
    templateUrl: './us.component.html',
    styleUrls: ['./us.component.scss']
})
export class UsComponent {

    static title = 'Nous';
    static fragment = 'us';

    constructor(private el: ElementRef) {
    }

    get top(): number {
        return this.el.nativeElement.offsetTop;
    }
}
