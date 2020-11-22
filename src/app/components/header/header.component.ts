import { filter, map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransmitService } from 'src/app/services/transmit.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
//这个在类上方装饰帮助自动销毁订阅，底下用pipe
@UntilDestroy()
export class HeaderComponent implements OnInit {
  title: string = '';
  startDate: Date;
  endDate: Date;
  calendar: boolean;
  pickTime: string = '';
  range: boolean;
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
  login: boolean;
  logout: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public service: TransmitService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => {
          return route?.firstChild;
        }),
        mergeMap((route) => route?.data)
      )
      .subscribe((data) => {
        this.title = data?.title;
        this.calendar = data?.calendar;
        this.startDate = new Date();
        this.endDate = undefined;
        this.service.changeInfo({
          startDate: this.startDate,
          endDate: this.endDate,
        });
        this.login = data.login;
        this.logout = data.logout;
        this.range = data.isRange;
        this.initPara();
      });
  }

  initPara() {
    this.state = {
      ...this.state,
      en: true,
      show: false,
      pickTime: false,
      now: new Date(),
      type: this.range ? 'range' : 'one',
      rowSize: 'normal',
      infinite: true,
      enterDirection: '',
      onSelect: undefined,
      showShortcut: false,
      defaultValue: undefined,
    };
  }

  onClick() {
    this.state = {
      ...this.state,
      show: true,
    };
  }

  triggerCancel() {
    this.state = {
      ...this.state,
      show: false,
    };
  }

  triggerConfirm(value) {
    const { startDate, endDate } = value;
    this.state = {
      ...this.state,
      show: false,
    };
    this.startDate = startDate;
    this.endDate = endDate;
    this.changeInfo({ startDate: this.startDate, endDate: this.endDate });
  }

  changeInfo(date) {
    this.service.changeInfo(date);
  }
  goLogin() {
    this.router.navigate(['/register']);
  }
  logOut() {
    this.service.removeTrans('users');
    this.router.navigate(['/cashbook']);
  }
}
