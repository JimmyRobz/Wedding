import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const IMAGES = [
    {
        url: `/assets/images/gallery/01.jpg`,
        width: 600,
        height: 607
    },
    {
        url: `/assets/images/gallery/02.jpg`,
        width: 600,
        height: 431
    },
    {
        url: `/assets/images/gallery/03.jpg`,
        width: 600,
        height: 791
    },
    {
        url: `/assets/images/gallery/04.jpg`,
        width: 600,
        height: 979
    },
    {
        url: `/assets/images/gallery/05.jpg`,
        width: 600,
        height: 930
    },
    {
        url: `/assets/images/gallery/06.jpg`,
        width: 600,
        height: 253
    },
    {
        url: `/assets/images/gallery/07.jpg`,
        width: 600,
        height: 361
    },
    {
        url: `/assets/images/gallery/08.jpg`,
        width: 600,
        height: 614
    },
    {
        url: `/assets/images/gallery/09.jpg`,
        width: 600,
        height: 631
    },
    {
        url: `/assets/images/gallery/10.jpg`,
        width: 600,
        height: 381
    },
    {
        url: `/assets/images/gallery/11.jpg`,
        width: 600,
        height: 800
    },
    {
        url: `/assets/images/gallery/12.jpg`,
        width: 600,
        height: 340
    },
    {
        url: `/assets/images/gallery/13.jpg`,
        width: 600,
        height: 636
    },
    {
        url: `/assets/images/gallery/14.jpg`,
        width: 600,
        height: 313
    },
    {
        url: `/assets/images/gallery/15.jpg`,
        width: 600,
        height: 450
    },
    {
        url: `/assets/images/gallery/16.jpg`,
        width: 600,
        height: 431
    },
    {
        url: `/assets/images/gallery/17.jpg`,
        width: 600,
        height: 528
    }
];

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
