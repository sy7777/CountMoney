import { Component, OnInit } from '@angular/core';
interface TabBarItem {
  name: string;
  icon: string;
  path: string;
}
@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css'],
})
export class TabMenuComponent implements OnInit {
  tabBarItems: TabBarItem[];

  constructor() {}

  ngOnInit(): void {
    this.tabBarItems = [
      {
        name: 'Transactions',
        icon: 'fas fa-file-invoice-dollar',
        path: '/transactions',
      },
      {
        name: 'Record',
        icon: 'fas fa-hand-holding-usd',
        path: '/record-bill',
      },
      {
        name: 'Reports',
        icon: 'fas fa-chart-pie',
        path: '/bill-analysis',
      },
      {
        name: 'Account',
        icon: 'fas fa-user',
        path: '/user-account',
      },
    ];
  }
}
