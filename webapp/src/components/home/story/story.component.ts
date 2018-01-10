import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss']
})
export class StoryComponent {

    static title = 'Notre histoire';
    static fragment = 'story';

    constructor(private el: ElementRef) {
    }

    get top(): number {
        return this.el.nativeElement.offsetTop;
    }
}
