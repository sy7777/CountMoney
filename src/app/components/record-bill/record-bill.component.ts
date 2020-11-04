import { Component, OnInit } from '@angular/core';
import { ToastService } from 'ng-zorro-antd-mobile';
interface IconList {
  path: string;
  name: string;
  type: string;
}
@Component({
  selector: 'app-record-bill',
  templateUrl: './record-bill.component.html',
  styleUrls: ['./record-bill.component.css'],
})
export class RecordBillComponent implements OnInit {
  iniconList: IconList[]; outiconList: IconList[];
  gridData = [];
  inIcon: any; outIcon: any;
  flag = true;
  index = 0;
  iconLen: number;
  pickTrans:{};
  pickIcon;

  numberFocus = {
    focus: false,
    date: new Date()
  };

  constructor(private _toast: ToastService) {
    this.iniconList = [
      { path: '/assets/icons/income.png', name: 'Salary', type: "in"},
      { path: '/assets/icons/plus.png', name: 'Add', type: "plus"}
    ];
    this.outiconList = [
      { path: '/assets/icons/cart.png', name: 'Glocery', type:"out"},
      { path: '/assets/icons/cloth.png', name: 'Cloth', type:"out"},
      { path: '/assets/icons/meal.png', name: 'Dine-in', type:"out"},
      { path: '/assets/icons/medical.png', name: 'Medical', type:"out"},
      { path: '/assets/icons/veg.png', name: 'Veg', type:"out"},
      { path: '/assets/icons/plus.png', name: 'Add', type: "plus"}
    ];
    this.inIcon = Array.from(
      this.iniconList.map((item) => {
        return { icon: item.path, text: item.name, type: item.type};
      })
    );
    this.outIcon = Array.from(
      this.outiconList.map((item) => {
        return { icon: item.path, text: item.name, type: item.type};
      })
    );
    this.init();
  }

  ngOnInit(): void {}

  click(event) {
    // console.log(typeof event);

    this.pickTrans = Object.values(event);
    this.pickIcon = this.pickTrans[0].icon;
    // console.log(this.pickIcon);
    console.log(this.pickIcon);
  }

  init() {
    // console.log(this.inIcon);
    // console.log(this.outIcon[0]);
    if(this.index == 0){
      this.iconLen = (this.outIcon && this.outIcon.length) || 0;
    }else{
      this.iconLen = (this.inIcon && this.inIcon.length) || 0;
    }
    let rowCount = Math.ceil(this.iconLen / 3);
    this.gridData = this.getRows(rowCount, this.iconLen);
  }
  getRows(rowCount: number, IconLength: number) {
    const columnNum = 3;
    const rowArr = new Array();
    for (let i = 0; i < rowCount; i++) {
      rowArr[i] = new Array();
      for (let j = 0; j < columnNum; j++) {
        const IconIndex = i * columnNum + j;
        if (IconIndex < IconLength) {
          rowArr[i][j] = this.inIcon[IconIndex];
        } else {
          rowArr[i][j] = null;
        }
      }
    }
    return rowArr;
  }

  onTabClick(item) {
    // console.log('onTabClick', item);
  }
}
