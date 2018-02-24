import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { ScrollToModule } from 'ng2-scroll-to-el';
import { AdminGuestsComponent } from '../components/admin/guests/admin-guests.component';
import { AdminLoginComponent } from '../components/admin/login/admin-login.component';

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
import { WitnessesComponent } from '../components/home/witnesses/witnesses.component';
import { NotFoundComponent } from '../components/notfound/notfound.component';
import { environment } from '../environments/environment';

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
    // Guests
    {
        path: 'guests',
        redirectTo: '/guests/rsvp',
        pathMatch: 'full'
    },
    {
        path: 'guests',
        component: GuestsComponent
    },
    {
        path: 'admin',
        redirectTo: '/admin/guests',
        pathMatch: 'full'
    },
    {
        path: 'admin/guests',
        component: AdminGuestsComponent
    },
    {
        path: 'admin/login',
        component: AdminLoginComponent
    },
    // Not Found
    {
        path: '**',
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
        WitnessesComponent,
        StoryComponent,
        EventsComponent,
        PicturesComponent,
        GuestbookComponent,
        GuestsComponent,
        AdminGuestsComponent,
        AdminLoginComponent,
        GuestsComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes),
        ScrollToModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
