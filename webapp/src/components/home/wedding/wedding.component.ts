import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment-timezone'

@Component({
    selector: 'wedding',
    templateUrl: './wedding.component.html',
    styleUrls: ['./wedding.component.scss']
})
export class WeddingComponent implements OnInit, OnDestroy {

    static title = 'Mariage';
    static fragment = 'wedding';
    static active = false;

    daysValue = '-';
    hoursValue = '-';
    minutesValue = '-';
    secondsValue = '-';

    interval: number;

    weddingDate = moment.tz("2018-10-12 14:00", "Indian/Reunion");

    ngOnInit(): void {
        this.interval = setInterval(() => this.updateTime(), 1000)
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    private updateTime() {
        const duration = moment.duration(this.weddingDate.diff(moment()));
        this.daysValue = Math.floor(duration.asDays()).toString();
        this.hoursValue = ('0' + duration.hours()).slice(-2);
        this.minutesValue = ('0' + duration.minutes()).slice(-2);
        this.secondsValue = ('0' + duration.seconds()).slice(-2);
    }
}
