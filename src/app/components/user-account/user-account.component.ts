import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { ModalRef, ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TransmitService } from 'src/app/services/transmit.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts/lib/base-chart.directive';
const data = [];
export interface User {
  avatar?: string;
  username?: string;
  des?: string;
  password?: string;
  userId?: string;
  budget?: string;
}
export interface UserFilter {
  username?: string;
  password?: string;
  userId?: string;
}
@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css'],
})
export class UserAccountComponent implements OnInit, OnDestroy {
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
  // unSubscribe: any;
  files = data.slice(0);
  multiple = false;
  modalRef: ModalRef;
  user: User;
  imgUrl: string =
    'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg';
  username: string;
  budgetNum: string;
  userDescription: string;
  constructor(
    private _modal: ModalService,
    private service: TransmitService,
    private firebase: FirebaseService,
    private _toast: ToastService
  ) {}
  ngOnDestroy(): void {
    // if (this.unSubscribe) {
    //   this.unSubscribe();
    // }
  }

  ngOnInit(): void {
    this.user = this.service.getTrans('users');
    // console.log(this.user);
    this.budgetNum = this.user.budget;
    this.renderPieChart();
  }

  async fileChange(params) {
    // console.log(params);
    const { files, type, index } = params;
    this.files = files;
    const preImgUrl = this.user.avatar;
    if (this.files[0]) {
      const res = await this.firebase.uploadFile(this.files[0].url);
      await this.firebase.updateUser({
        userId: this.user.userId,
        avatar: await res.ref.getDownloadURL(),
      });
      if (preImgUrl) {
        this.firebase.delPreImg(preImgUrl);
      }
      this.user = this.service.getTrans('users');
    }
  }
  showUploadImg(tem: TemplateRef<any>) {
    this.modalRef = this._modal.alert(tem, undefined, [
      { text: 'Close', onPress: () => this.modalRef?.close() },
    ]);
    // console.log(tem);
  }
  editProfile(tem: TemplateRef<any>) {
    this.modalRef = this._modal.alert(
      'Edit Your Profile',
      tem,
      [
        { text: 'Cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            if (
              typeof this.username === 'string' ||
              typeof this.userDescription === 'string'
            ) {
              await this.firebase.updateUser({
                userId: this.user.userId,
                username: this.username || 'Users',
                des: this.userDescription || 'This person is lazy...',
              });
            } else {
              this._toast.fail("You don't change anything!", 3000);
            }
            this.user = this.service.getTrans('users');
          },
        },
      ],
      'default'
    );
  }
  numberFocus = {
    focus: false,
  };
  editBudget(tem: TemplateRef<any>) {
    this.modalRef = this._modal.alert(
      'Set Your Budget',
      tem,
      [
        { text: 'Cancel' },
        {
          text: 'Submit',
          onPress: () => {
            if (this.budgetNum) {
              this.service.setTrans('users', {
                ...this.user,
                budget: this.budgetNum,
              });
              this.user = this.service.getTrans('users');
            } else {
              this._toast.offline('You should enter a number', 3000);
            }
            this.renderPieChart();
          },
        },
      ],
      'default'
    );
  }
  renderPieChart() {
    const amountArr = [];
    let totalMoney = 0;
    this.firebase.getTransFromDB(this.user.userId).onSnapshot((snap) => {
      snap.forEach((value) => {
        amountArr.push(value.data().amount);
      });
      // console.log(amountArr);
      amountArr.forEach((item) => {
        totalMoney += item;
      });
      // console.log(totalMoney);
      const processedArr = [
        { text: 'Used Money', amount: totalMoney },
        {
          text: 'Your Budget Left',
          amount: parseFloat(this.budgetNum) + totalMoney,
        },
      ];
      this.chartLabels = processedArr.map((item) => item.text);
      this.chartData = [{ data: processedArr.map((item) => item.amount) }];
    });
  }
}
