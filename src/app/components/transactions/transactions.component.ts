
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransmitService } from 'src/app/services/transmit.service';
import { TransListItem } from '../record-bill/record-bill.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
@UntilDestroy()

export class TransactionsComponent implements OnInit {
  public month: any;
  totalMoney: number = 0;
  transactionList: TransListItem[] = [];
  display: boolean = true;
  renderObj: any;
  dateKeys:string[];
  constructor(private service: TransmitService) {
    // this.transactionList = this.service.getTrans("trans");
    // console.log(this.transactionList);


  }

  ngOnInit() {
    this.month = new Date().toDateString();
    this.service.getPickTime().pipe(untilDestroyed(this)
    ).subscribe((msg) => {
      this.month = msg;
      // console.log(this.month);
    });
    this.renderList();
    this.renderTotalMoney();
  }

  renderTotalMoney() {
    this.totalMoney = 0;
    this.transactionList?.forEach((element) => {
      this.totalMoney += element.amount;
    });
    return this.totalMoney;
  }

  renderList() {
    const renderObj = {};
    this.transactionList = this.service.getTrans("trans");
    this.transactionList.forEach(ele => {
      if (!renderObj[ele.time]) {
        renderObj[ele.time] = [ele];
        console.log(new Date(ele.time));
      } else {
        renderObj[ele.time].push(ele);
      }

    });

    this.dateKeys = Object.keys(renderObj).sort((b,a)=>{
      if(new Date(a)>new Date(b)){
        return 1}else if(new Date(a)<new Date(b)){
          return -1;
        }else{
          return 0;
        }
    });
    this.renderObj = renderObj;
    console.log(Object.keys(this.renderObj));
    console.log(this.renderObj);

  }
  delTransItem(id) {
    const index = this.transactionList.indexOf(this.transactionList.find(ele =>
      ele.id === id
    ));
    this.transactionList.splice(index, 1);
    this.service.setTrans("trans", this.transactionList);
    this.renderList();
    this.renderTotalMoney();

  }
  isDisplay() {
    this.transactionList.forEach(element => {
      console.log(this.month);
      if (element.time !== this.month) {
        // element.display = false;
        // this.display =  element.display
        return this.display;
      } else {
        // element.display = true;
        // this.display =  element.display;
        return this.display;
      }
    });
  }

  sortDate(a,b){

  }
}
