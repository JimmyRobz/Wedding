import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'wedding',
    templateUrl: './wedding.component.html',
    styleUrls: ['./wedding.component.scss']
})
export class WeddingComponent {

    static title = 'Mariage';
    static fragment = 'wedding';

    constructor(private el: ElementRef) {
    }

    get top(): number {
        return this.el.nativeElement.offsetTop;
    }
}
