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
  totalMoney: number = 0;
  transactionList:any=[];
  display:boolean = true;
  constructor(private service: TransmitService) {
    this.transactionList = this.service.getTrans("trans")
    // console.log(this.transactionList);
    this.renderTotalMoney();
  }

  ngOnInit() {
    this.month = new Date().toDateString();
    this.service.getPickTime().pipe(untilDestroyed(this)
      ).subscribe((msg) => {
      this.month = msg;
      // console.log(this.month);
    });
    this.isDisplay()
  }

  renderTotalMoney() {
    this.totalMoney = 0;
    console.log(this.transactionList);
    this.transactionList?.forEach((element) => {
      console.log();

      this.totalMoney += element.amount;
    });
    return this.totalMoney;
  }

  delTransItem(index){
    this.transactionList.splice(index,1);
    this.service.setTrans("trans", this.transactionList);
    console.log(this.transactionList);

    this.renderTotalMoney();
  }
  isDisplay(){
    this.transactionList.forEach(element => {
      if(element.time !== this.month){this.display = false;}
    });
  }
}
