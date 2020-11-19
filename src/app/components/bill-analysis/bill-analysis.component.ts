import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TransmitService } from 'src/app/services/transmit.service';
import { TransListItem } from '../record-bill/record-bill.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@Component({
  selector: 'app-bill-analysis',
  templateUrl: './bill-analysis.component.html',
  styleUrls: ['./bill-analysis.component.css'],
})
@UntilDestroy()
export class BillAnalysisComponent implements OnInit, OnDestroy {
  currentUser: any;
  time: string;
  unsubscribe: any;
  transaction: TransListItem[];
  analysisList = [];
  percent;

  constructor(
    private service: TransmitService,
    private firebase: FirebaseService
  ) {}

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.currentUser = this.service.getTrans('users');
    this.time = new Date().getMonth().toLocaleString();
    this.service
      .getPickTime()
      .pipe(untilDestroyed(this))
      .subscribe((msg) => {
        this.time = msg;
      });
    this.renderAnalysisList();
  }
  renderAnalysisList() {
    this.unsubscribe = this.firebase
      .getTransFromDB(this.currentUser.userId)
      .onSnapshot((snapshot) => {
        let transaction = [];
        let renderObj = {};
        snapshot.forEach((doc) => {
          transaction.push(doc.data());
        });
        transaction.forEach((ele) => {
          if (!renderObj[ele.text]) {
            renderObj[ele.text] = [ele];
          } else {
            renderObj[ele.text].push(ele);
          }
        });
        let catetotalMoneyList = [];
        for (let singleItem in renderObj) {
          let singleItemMoney;
          let catetotalMoney = 0;
          for (let i = 0; i < renderObj[singleItem].length; i++) {
            singleItemMoney = renderObj[singleItem][i].amount;
            catetotalMoney += singleItemMoney;
          }
          catetotalMoneyList.push(catetotalMoney);
          let totalMoney = eval(catetotalMoneyList.join('+')) || 0;
          //直接把他变成各个数的加法运算字符串
          this.analysisList.push({
            cateIcon: renderObj[singleItem][0].icon,
            cateText: singleItem,
            catePercent: (Math.abs(catetotalMoney) / Math.abs(totalMoney)).toFixed(1),
            catetotalAmount: catetotalMoney,
          });
        }
      });
  }
  choose(event) {
    console.log('index: ', event.selectedIndex, 'value: ', event.value);
  }
}
