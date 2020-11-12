import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TransmitService } from 'src/app/services/transmit.service';
import { TransListItem } from '../record-bill/record-bill.component';
import { User } from '../user-account/user-account.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
@UntilDestroy()
export class TransactionsComponent implements OnInit, OnDestroy {
  public month: any;
  totalMoney: number = 0;
  transactionList: TransListItem[];
  display: boolean = true;
  renderObj: any;
  dateKeys: string[];
  currentUser: User;
  unsubscribe:any;
  constructor(
    private service: TransmitService,
    private firebase: FirebaseService
  ) {}
  ngOnDestroy(): void {
    if (this.unsubscribe){
      this.unsubscribe();
    }
  }

  ngOnInit() {
    this.currentUser = this.service.getTrans('users');
    this.month = new Date().toDateString();
    this.service
      .getPickTime()
      .pipe(untilDestroyed(this))
      .subscribe((msg) => {
        this.month = msg;
        // console.log(this.month);
      });
    this.renderList();

  }

  renderTotalMoney() {
    this.totalMoney = 0;
    this.transactionList?.forEach((element) => {
      this.totalMoney += element.amount;
    });
    return this.totalMoney;
  }

  renderList() {
    this.unsubscribe=this.firebase.getTransFromDB(
      this.currentUser.userId
    ).onSnapshot((snapshot)=>{
      const transaction = [];
      const renderObj = {};
      snapshot.forEach(doc=>{
        transaction.push(doc.data());
      })
      this.transactionList = transaction;
      this.transactionList.forEach((ele) => {
        console.log(ele);
        if (!renderObj[ele.time]) {
          renderObj[ele.time] = [ele];
          // console.log(new Date(ele.time));
        } else {
          renderObj[ele.time].push(ele);
        }
      });

      this.dateKeys = Object.keys(renderObj).sort((b, a) => {
        if (new Date(a) > new Date(b)) {
          return 1;
        } else if (new Date(a) < new Date(b)) {
          return -1;
        } else {
          return 0;
        }
      });
      this.renderObj = renderObj;
      this.renderTotalMoney();
    });
    console.log(this.transactionList);
    // console.log(Object.keys(this.renderObj));
    // console.log(this.renderObj);
  }

  async delTransItem(id) {
    await this.firebase.delTransItem(this.currentUser.userId, id);
  }
}
