import { filter, map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
//这个在类上方装饰帮助自动销毁订阅，底下用pipe
@UntilDestroy()
export class HeaderComponent implements OnInit {
  title: string = '';
  calendar: boolean;
  date:string;
  state: any = {
    en: true,
    show: false,
    pickTime: true,
    now: new Date(),
    type: 'range',
    enterDirection: '',
    rowSize: 'normal',
    showShortcut: false,
    infinite: true,
    defaultValue: undefined,
    onSelect: undefined,
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((event) => event instanceof NavigationEnd),
        map((event) => this.route),
        map((route) => {
          return route?.firstChild;
        }),
        mergeMap((route) => route?.data)
      )
      .subscribe((data) => {
        this.title = data?.title;
        this.calendar = data?.calendar;
        this.date = new Date().toDateString();
      });
  }

  initPara() {
    this.state = {
      ...this.state,
      ...{
        show: false,
        pickTime: false,
        now: new Date(),
        type: 'one',
        rowSize: 'normal',
        infinite: true,
        enterDirection: '',
        onSelect: undefined,
        showShortcut: false,
        defaultValue: undefined,
      }
    };
  }

  onClick() {
    this.initPara();
    this.state.show = true;
  }

  triggerCancel() {
    this.state.show = false;
  }

  triggerConfirm(value) {
    const { startDate, endDate } = value;
    this.state = {
      ...this.state,
      show: false
    };
    this.date = startDate;
  }

  triggerSelectHasDisableDate(dates) {
    console.warn('onSelectHasDisableDate', dates);
  }
}
