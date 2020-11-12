import { filter, map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit} from '@angular/core';
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
  date: any = '';
  calendar: boolean;
  pickTime: string = '';

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
  login:boolean;
  logout:boolean;
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
        this.date = new Date().toDateString();
        // this.date = new Date();
        this.service.info = this.date;
        this.login = data.login;
        this.logout = data.logout
      });
      console.log(this.date);
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
      },
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
    const { startDate } = value;
    this.state = {
      ...this.state,
      show: false,
    };
    this.date = startDate;
    // this.pickTime = this.date.getTime().format('yyyy/MM/dd');
    this.pickTime = this.date.toDateString();
    this.changeInfo(this.pickTime);
  }

  changeInfo(date){
    this.service.changeInfo(date);
  }
  triggerSelectHasDisableDate(dates) {
    console.warn('onSelectHasDisableDate', dates);
  }
  goLogin(){
    this.router.navigate(["/register"]);
  }
  logOut(){
    this.service.removeTrans("users");
    this.router.navigate(['/cashbook']);
  }
}
