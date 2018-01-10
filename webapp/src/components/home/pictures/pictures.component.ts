import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'pictures',
    templateUrl: './pictures.component.html',
    styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent {

    static title = 'Photos';
    static fragment = 'pictures';

    constructor(private el: ElementRef) {
    }

    get top(): number {
        return this.el.nativeElement.offsetTop;
    }
}
