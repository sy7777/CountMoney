import { Component, OnInit } from '@angular/core';
import { ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { TransmitService } from 'src/app/services/transmit.service';
import { v4 as uuidv4 } from 'uuid';
interface IconList {
  path: string;
  name: string;
  type: string;
}
export interface TransListItem {
  icon: string;
  text: string;
  amount: number;
  type: string;
  time: string;
  id: string;
}

@Component({
  selector: 'app-record-bill',
  templateUrl: './record-bill.component.html',
  styleUrls: ['./record-bill.component.css'],
})
@UntilDestroy()

export class RecordBillComponent implements OnInit {
  iniconList: IconList[];
  outiconList: IconList[];
  gridData = [];
  inIcon: any; outIcon: any;
  index = 0;
  pickTrans: TransListItem;
  public transList: TransListItem[]=[];
  public time: any;
  constructor(private _toast: ToastService, private _modal: ModalService, private service: TransmitService) {

    this.iniconList = [
      { path: '/assets/icons/income.png', name: 'Salary', type: 'in' },
      { path: '/assets/icons/plus.png', name: 'Add', type: 'plus' },
    ];
    this.outiconList = [
      { path: '/assets/icons/cart.png', name: 'Glocery', type: 'out' },
      { path: '/assets/icons/cloth.png', name: 'Cloth', type: 'out' },
      { path: '/assets/icons/meal.png', name: 'Dine-in', type: 'out' },
      { path: '/assets/icons/medical.png', name: 'Medical', type: 'out' },
      { path: '/assets/icons/veg.png', name: 'Veg', type: 'out' },
      { path: '/assets/icons/plus.png', name: 'Add', type: 'plus' },
    ];
    this.inIcon = Array.from(
      this.iniconList.map((item) => {
        return { icon: item.path, text: item.name, type: item.type };
      })
    );
    this.outIcon = Array.from(
      this.outiconList.map((item) => {
        return { icon: item.path, text: item.name, type: item.type };
      })
    );
    this.init();

     this.transList = this.service.getTrans("trans");
  }
  ngOnInit(): void {
    this.service.getPickTime().pipe(untilDestroyed(this)
    ).subscribe((msg) => {
      this.time = msg;
      console.log(this.time);
    });
  }

  init() {
    // console.log(this.inIcon);
    // console.log(this.outIcon[0]);
    let iconLen = 0
    if (this.index === 0) {
      // this.iconLen = (this.outIcon && this.outIcon.length) || 0;
      iconLen = (this.outIcon && this.outIcon.length) || 0;
    } else {
      // this.iconLen = (this.inIcon && this.inIcon.length) || 0;
      iconLen = (this.inIcon && this.inIcon.length) || 0;
    }
    let rowCount = Math.ceil(iconLen / 3);
    this.gridData = this.getRows(rowCount, iconLen);
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
  showPromptDefault(event) {
    this.pickTrans = event.data;
    this._modal.prompt(
      'Enter Amount',
      `You spent money on ${this.pickTrans.text}`,
      [{ text: 'Cancel' }, {
        text: 'Submit', onPress: value => {
          if (typeof parseFloat(value)) {
            if (this.pickTrans.type === "out") {
              this.pickTrans.amount = -parseFloat(value);
              this.pickTrans.time = this.time || new Date().toDateString();
              this.pickTrans.id = uuidv4();
              this.saveToCloud();
            }
            if (this.pickTrans.type === "in") {
              this.pickTrans.amount = parseFloat(value);
              this.pickTrans.time = this.time || new Date().toDateString();
              this.pickTrans.id = uuidv4();
              this.saveToCloud();
            }
            if (this.pickTrans.type !== "in" && this.pickTrans.type !== "out") {
              alert("WRONG")
            }

          }
        }
      }], 'default'
    );
  }

  saveToCloud() {
    this.transList.push(this.pickTrans);
    this.service.setTrans("trans", this.transList);
    console.log(this.transList);
  }
}
