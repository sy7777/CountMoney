import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransmitService } from 'src/app/services/transmit.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
@UntilDestroy()

export class TransactionsComponent implements OnInit {
  public month: any;
  itemAmount: number;
  totalMoney: number = 0;
  transactionList = [
    { path: 'label fab fa-amazon', name: '亚马逊购物', amount: '-60' },
    { path: 'label fas fa-shopping-cart', name: '购物', amount: '-40' },
    { path: 'label fas fa-credit-card', name: '工资', amount: '+400' },
  ];
  transAmoutList = [];

  constructor(private service: TransmitService) {}

  ngOnInit() {
    this.month = new Date().toDateString();
    this.service.getPickTime().pipe(untilDestroyed(this)
      ).subscribe((msg) => {
      this.month = msg;
      // console.log(this.month);
    });
    this.renderTotalMoney();
  }

  renderTotalMoney() {
    this.transactionList.forEach((element) => {
      this.transAmoutList.push(element.amount);
    });
    this.transAmoutList.forEach((item) => {
      this.itemAmount = parseFloat(item);
      this.totalMoney += this.itemAmount;
      // console.log(this.totalMoney);
    });
  }
}
