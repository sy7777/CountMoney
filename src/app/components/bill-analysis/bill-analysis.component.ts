import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TransmitService } from 'src/app/services/transmit.service';
import { TransListItem } from '../record-bill/record-bill.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts/lib/base-chart.directive';
import { Transfilter } from '../transactions/transactions.component';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bill-analysis',
  templateUrl: './bill-analysis.component.html',
  styleUrls: ['./bill-analysis.component.css'],
})
@UntilDestroy()
export class BillAnalysisComponent implements OnInit, OnDestroy {
  currentUser: any;
  startDate: Date;
  endDate: Date;
  unsubscribe: any;
  analysisList: Array<{
    icon: string;
    text: string;
    percentage: string;
    amount: number;
  }> = [];
  tabIndex: number = 0;
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      labels: {
        render: 'percentage',
        // fontColor: ['green', 'white', 'red'],
        precision: 2,
      },
    },
  };
  plugins = [pluginDataLabels];
  chartLabels: Label[] = [];
  chartData: ChartDataSets[] = [];
  subscription: Subscription;
  constructor(
    private service: TransmitService,
    private firebase: FirebaseService
  ) {}

  ngOnDestroy(): void {
      this.unsubscribe?.();
    // this.subscription?.unsubscribe();
  }
  ngOnInit(): void {
    this.currentUser = this.service.getTrans('users');
    this.renderAnalysisList();
    this.service
      .getPickTime()
      .pipe(untilDestroyed(this))
      .subscribe((msg) => {
        this.startDate = msg?.startDate;
        this.endDate = msg?.endDate;
        this.renderAnalysisList();
      });
    this.service.getUserId().subscribe((userID)=>{
      console.log(userID);
      this.service.getUserBank(userID).subscribe((bankID)=>{
        console.log(bankID);
        this.service.getUserBanlance(bankID).subscribe((balance)=>{
          console.log(balance);
          
        })
      });
    });
    
    this.service.getUserId()
    .pipe(
      switchMap(userID=> this.service.getUserBank(userID)),
      switchMap(bankID=> this.service.getUserBanlance(bankID))
      ).subscribe(balance=>console.log(balance)
      );

    this.subscription =this.service.mock().subscribe(num=>console.log(num)
    )
  }
  renderAnalysisList() {
    let filter: Transfilter;
    if (!this.tabIndex) {
      filter = {
        out: true,
        in: false,
        startDate: this.startDate,
        endDate: this.endDate,
      };
    } else {
      filter = {
        in: true,
        out: false,
        startDate: this.startDate,
        endDate: this.endDate,
      };
    }
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.unsubscribe = this.firebase
      .getTransFromDB(this.currentUser.userId, filter)
      .onSnapshot((snapshot) => {
        let transaction = [];
        snapshot.forEach((doc) => {
          transaction.push(doc.data());
        });
        this.processData(transaction);
        // console.log(transaction);
      });
  }

  processData(arr: TransListItem[]) {
    const processedArr: Array<{
      icon: string;
      text: string;
      amount: number;
    }> = [];
    let totalAmount = 0;
    arr.forEach((item) => {
      // console.log(item);
      const found = processedArr.find((value) => {
        // console.log(value,"1111");
        return value.text === item.text;
      });
      // console.log(item);
      // console.log(found);
      totalAmount += Math.abs(item.amount);
      if (found) {
        found.amount = found.amount + Math.abs(item.amount);
      } else {
        processedArr.push({
          icon: item.icon,
          text: item.text,
          amount: Math.abs(item.amount),
        });
      }
    });
    this.chartLabels = processedArr.map((item) => item.text);
    this.chartData = [{ data: processedArr.map((item) => item.amount) }];
    this.analysisList = processedArr.map((item) => ({
      icon: item.icon,
      text: item.text,
      amount: item.amount,
      percentage: `${((item.amount / totalAmount) * 100).toFixed(2)}%`,
    }));
  }

  choose(event) {
    this.tabIndex = event.selectedIndex;
    this.renderAnalysisList();
  }
  
}
