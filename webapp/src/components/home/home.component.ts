import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as WindowEvents from 'windowevents';
import { EventsComponent } from './events/events.component';
import { GuestbookComponent } from './guestbook/guestbook.component';
import { GuestsComponent } from './guests/guests.component';
import { PicturesComponent } from './pictures/pictures.component';
import { StoryComponent } from './story/story.component';
import { UsComponent } from './us/us.component';
import { WeddingComponent } from './wedding/wedding.component';

const HOME_SECTIONS = [
    UsComponent,
    WeddingComponent,
    StoryComponent,
    EventsComponent,
    PicturesComponent,
    GuestbookComponent,
    GuestsComponent
];

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    entryComponents: HOME_SECTIONS
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

    public sections = HOME_SECTIONS;

    public activeTab: String;
    public currentFragment: String;

    private scrollOffset = 0;

    private windowEvents = new WindowEvents();

    private isViewInitialized = false;

    @ViewChild('sectionsContainer')
    private sectionsContainer: ElementRef;

    constructor(private route: ActivatedRoute, private router: Router, private el: ElementRef) {
        route.fragment.subscribe(fragment => this.onFragmentChange(fragment));
    }

    ngOnInit(): void {
        this.windowEvents.on('resize.stop', () => this.calculateScrollOffset());
    }

    ngOnDestroy(): void {
        this.windowEvents.off('resize.stop');
    }

    ngAfterViewInit(): void {
        this.isViewInitialized = true;
        this.calculateScrollOffset();
        this.scrollToFragment();
    }

    onTabClick(fragment) {
        if (this.currentFragment == fragment) {
            this.scrollToFragment();
        }
    }

    private calculateScrollOffset() {
        this.scrollOffset = this.sectionsContainer.nativeElement.offsetTop;
    }

    private async onFragmentChange(fragment: String) {
        if (fragment != null) {
            this.currentFragment = fragment;
            this.activeTab = fragment;
            this.scrollToFragment();
        } else {
            await this.router.navigate(['/home'], {
                fragment: 'us',
                replaceUrl: true
            });
        }
    }

    @HostListener('window:scroll', ['$event'])
    private onScroll(event) {
        const scrollTop = document.documentElement.scrollTop;

        if (scrollTop + window.innerHeight >= document.documentElement.offsetHeight) return;

        const sections = this.sectionsContainer.nativeElement.children;
        for (let index = sections.length - 1; index >= 0; index--) {
            const section = sections[index];
            const top = section.offsetTop;
            const threshold = scrollTop + this.scrollOffset;
            if (top <= threshold) {
                const fragment = section.tagName.toLowerCase();
                if (this.activeTab !== fragment) this.activeTab = fragment;
                return;
            }
        }
    }

    private scrollToFragment() {
        if (this.isViewInitialized && this.currentFragment) {
            scrollTo(0, this.el.nativeElement.querySelector(this.currentFragment).offsetTop - this.scrollOffset);
        }
    }
}
