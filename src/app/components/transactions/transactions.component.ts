import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from 'ng-zorro-antd-mobile';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TransmitService } from 'src/app/services/transmit.service';
import { TransListItem } from '../record-bill/record-bill.component';
import { User } from '../user-account/user-account.component';
export interface Transfilter {
  in?: boolean;
  out?: boolean;
  startDate?: Date;
  endDate?: Date;
}
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
@UntilDestroy()
export class TransactionsComponent implements OnInit, OnDestroy {
  public startDate: Date;
  endDate: Date;
  totalMoney: number = 0;
  transactionList: TransListItem[];
  display: boolean = true;
  renderObj: any;
  dateKeys: string[];
  currentUser: User;
  unsubscribe: any;
  constructor(
    private service: TransmitService,
    private firebase: FirebaseService,
    private _modal: ModalService
  ) {}
  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  ngOnInit() {
    this.currentUser = this.service.getTrans('users');
    this.service
      .getPickTime()
      .pipe(untilDestroyed(this))
      .subscribe((msg) => {
        this.startDate = msg?.startDate;
        this.endDate = msg?.endDate;
        this.renderList();
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
    if(this.unsubscribe){
      this.unsubscribe();
    }
    let filter: Transfilter = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.unsubscribe = this.firebase
      .getTransFromDB(this.currentUser.userId, filter)
      .onSnapshot((snapshot) => {
        const transaction = [];
        const renderObj = {};
        snapshot.forEach((doc) => {
          const data = {
            ...doc.data(),
            time: doc.data().time.toDate(),
          };
          transaction.push(data);
        });
        this.transactionList = transaction;
        this.transactionList.forEach((ele) => {
          if (!renderObj[ele.time?.toDateString()]) {
            renderObj[ele.time?.toDateString()] = [ele];
          } else {
            renderObj[ele.time?.toDateString()].push(ele);
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
  }

  delTransItem(id) {
    this._modal.alert('Delete', 'Are you sure ?', [
      { text: 'Cancel' },
      {
        text: 'OK',
        onPress: async () => {
          await this.firebase.delTransItem(this.currentUser.userId, id);
        },
      },
    ]);
  }
}
