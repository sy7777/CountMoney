import { Component, OnInit } from '@angular/core';
const data = [
];
@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css'],
})
export class UserAccountComponent implements OnInit {
  files = data.slice(0);
  length = 1;
  constructor() {}

  ngOnInit(): void {}

  fileChange(params) {
    console.log(params);
    const { files, type, index } = params;
    this.files = files;
  }
}
