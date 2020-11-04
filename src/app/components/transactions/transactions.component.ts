import { Component, OnInit } from '@angular/core';
import { TransmitService } from 'src/app/services/transmit.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  public month: any;
  itemAmount: number;
  totalMoney: number = 0;
  /*   transMonthList = [
    {date: `${this.month}`, }
  ]; */
  transactionList = [
    { icon: 'label fab fa-amazon', name: '亚马逊购物', amount: '-60' },
    { icon: 'label fas fa-shopping-cart', name: '购物', amount: '-40' },
    { icon: 'label fas fa-credit-card', name: '工资', amount: '+400' },
  ];
  transAmoutList = [];

  constructor(private service: TransmitService) {}

  ngOnInit() {
    this.month = new Date().toDateString();
    // console.log(this.month);

    /*     this.month = this.service.info.getMonth()+1;
    console.log(this.month); */
    this.service.infoSource.subscribe((msg) => {
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
