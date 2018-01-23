import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const IMAGES = [[800, 600], [600, 800], [1024, 768], [768, 1024], [1920, 1080], [1080, 1920], [1440, 980], [980, 1440], [800, 620], [620, 800], [1440, 920], [920, 1440]].map(size => {
    return {
        url: `https://picsum.photos/${size[0]}/${size[1]}`,
        width: size[0],
        height: size[1]
    }
});

@Component({
    selector: 'pictures',
    templateUrl: './pictures.component.html',
    styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent implements AfterViewInit {

    static title = 'Photos';
    static fragment = 'pictures';

    images = IMAGES;

    @ViewChild('tinyGallery') tinyGallery: ElementRef;
    @ViewChild('smallGallery') smallGallery: ElementRef;
    @ViewChild('mediumGallery') mediumGallery: ElementRef;
    @ViewChild('largeGallery') largeGallery: ElementRef;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngAfterViewInit() {
        $([this.largeGallery.nativeElement, this.mediumGallery.nativeElement, this.smallGallery.nativeElement, this.tinyGallery.nativeElement]).justifiedImages({
            images: this.images,
            rowHeight: 200,
            maxRowHeight: 400,
            thumbnailPath: image => image.url,
            getSize: image => {
                return {width: image.width, height: image.height};
            },
            margin: 3
        });
    }

    sanitize(url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
}

interface Picture {
    url: string,
    width: number,
    height: number
}
