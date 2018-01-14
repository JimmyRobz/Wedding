import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'pictures',
    templateUrl: './pictures.component.html',
    styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent {

    static title = 'Photos';
    static fragment = 'pictures';

    images: Array<Picture>;

    constructor(private sanitizer: DomSanitizer) {
        this.images = PicturesComponent.createRandomImages();
    }

    private static createRandomImages(): Array<Picture> {
        return [[800, 600], [1024, 768], [1920, 1080], [1440, 980], [800, 600], [1440, 980]].map(size => {
            return {
                url: `https://picsum.photos/${size[0]}/${size[1]}/?random`,
                width: size[0],
                height: size[1]
            }
        });
    }

    sanitize(url) {
        return this.sanitizer.bypassSecurityTrustStyle(`url("${url}")`)
    }
}

interface Picture {
    url: string,
    width: number,
    height: number
}
