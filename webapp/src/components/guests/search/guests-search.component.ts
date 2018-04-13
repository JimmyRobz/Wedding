import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'guests-search',
    templateUrl: './guests-search.component.html',
    styleUrls: ['./guests-search.component.scss']
})
export class GuestsSearchComponent implements OnInit {

    searchTerm = new Subject<string>();
    suggestions: any = undefined;

    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
        this.searchTerm
            .debounceTime(500)
            .subscribe(query => this.search(query))
    }

    async search(query: string) {
        if (query) {
            this.suggestions = await this.http.get(environment.api + 'guest/search/' + query).toPromise();
        } else {
            this.suggestions = undefined;
        }
    }

    onKeyUp(value) {
        this.suggestions = null;
        this.searchTerm.next(value)
    }
}
