import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-log-in',
  templateUrl: './not-log-in.component.html',
  styleUrls: ['./not-log-in.component.css']
})
export class NotLogInComponent implements OnInit {

  state = {
    data: ['register', 'showlist', 'record', 'account'],
    imgHeight: '466px'
  };
  constructor() { }

  ngOnInit(): void {
  }

  onClick1() {
    this.state.data.push('AiyWuByWklrrUDlFignR');
  }
  beforeChange(event) {
    // console.log('slide ' + event.from + ' to ' + event.to);
  }

  afterChange(event) {
    // console.log('slide to ' + event);
  }

}
