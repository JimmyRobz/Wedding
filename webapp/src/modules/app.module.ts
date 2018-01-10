import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ScrollToModule } from 'ng2-scroll-to-el';

import { AppComponent } from '../components/app/app.component';
import { HeaderComponent } from '../components/header/header.component';
import { EventsComponent } from '../components/home/events/events.component';
import { GuestbookComponent } from '../components/home/guestbook/guestbook.component';
import { GuestsComponent } from '../components/home/guests/guests.component';
import { HomeComponent } from '../components/home/home.component';
import { PicturesComponent } from '../components/home/pictures/pictures.component';
import { StoryComponent } from '../components/home/story/story.component';
import { UsComponent } from '../components/home/us/us.component';
import { WeddingComponent } from '../components/home/wedding/wedding.component';
import { NotFoundComponent } from '../components/notfound/notfound.component';

const routes: Routes = [
    // Home
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    // Not Found
    {
        path: 'notfound',
        component: NotFoundComponent
    }
];

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        UsComponent,
        WeddingComponent,
        StoryComponent,
        EventsComponent,
        PicturesComponent,
        GuestbookComponent,
        GuestsComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        ScrollToModule.forRoot()
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
