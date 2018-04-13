import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'rxjs/add/observable/combineLatest';

import "rxjs/add/operator/debounceTime"
import "rxjs/add/operator/distinctUntilChanged"
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';

import { environment } from './environments/environment';

import { AppModule } from './modules/app.module';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));
