import { Component, OnInit } from '@angular/core';
import { ModalRef, ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { TransmitService } from 'src/app/services/transmit.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user-account/user-account.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import {
  defaultInIcon,
  defaultOutIcon,
  iconPaths,
  TransIcon,
} from 'src/app/util/iconPath';
interface IconList {
  path: string;
  name: string;
  type: string;
}
export interface TransListItem {
  userId?: string;
  icon?: string;
  text?: string;
  amount?: number;
  time?: string;
  id?: string;
}

@Component({
  selector: 'app-record-bill',
  templateUrl: './record-bill.component.html',
  styleUrls: ['./record-bill.component.css'],
})
@UntilDestroy()
export class RecordBillComponent implements OnInit {
  iniconList: TransIcon[];
  outiconList: TransIcon[];

  index = 0;
  pickIcon: TransIcon;
  defaultIcon: string = 'assets/icons/expense.png';
  currentUser: User;
  public transList: TransListItem[] = [];
  public time: string;
  constructor(
    private _toast: ToastService,
    private _modal: ModalService,
    private service: TransmitService,
    private firebase: FirebaseService
  ) {
    this.iniconList = defaultInIcon;
    this.outiconList = defaultOutIcon;
    this.init();
    // this.transList = this.service.getTrans('trans');
  }
  async ngOnInit() {
    this.service
      .getPickTime()
      .pipe(untilDestroyed(this))
      .subscribe((msg) => {
        this.time = msg;
        console.log(this.time);
      });
    this.currentUser = this.service.getTrans('users');
  }

  init() {
    // console.log(this.inIcon);
    // console.log(this.outIcon[0]);
    let iconLen = 0;
    if (this.index === 0) {
      // this.iconLen = (this.outIcon && this.outIcon.length) || 0;
      iconLen = this.outiconList?.length || 0;
    } else {
      // this.iconLen = (this.inIcon && this.inIcon.length) || 0;
      iconLen = this.iniconList?.length || 0;
    }
  }

  onTabClick(item) {
    // console.log('onTabClick', item);
  }
  showPromptDefault(event) {
    if (event.data.add) {
    } else {
      this.pickIcon = event.data;
      const ref: ModalRef = this._modal.prompt(
        'Enter Amount',
        `You spent money on ${event.data.name}`,
        [
          {
            text: 'Cancel',
            onPress: () => {
              this.pickIcon = undefined;
            },
          },
          {
            text: 'Submit',
            onPress: (value) => {
              return new Promise((res, rej) => {
                if (!isNaN(parseFloat(value))) {
                  let trans: TransListItem;
                  if (this.index === 0) {
                    trans = {
                      text: event.data.text,
                      userId: this.currentUser.userId,
                      time: this.time || new Date().toDateString(),
                      id: uuidv4(),
                      amount: -parseFloat(value),
                      icon: event.data.icon,
                    };
                    this.saveTransToCloud(trans);
                  }
                  if (this.index === 1) {
                    trans = {
                      text: event.data.text,
                      userId: this.currentUser.userId,
                      time: this.time || new Date().toDateString(),
                      id: uuidv4(),
                      amount: parseFloat(value),
                      icon: event.data.icon,
                    };
                    this.saveTransToCloud(trans);
                  }
                  this.pickIcon = undefined;
                  res();
                } else {
                  this._toast.offline('Please Enter a Number!', 3000);
                }
              });
            },
          },
        ],
        'default'
      );
      ref.triggerOk = undefined;
    }
  }

  saveTransToCloud(trans: TransListItem) {
    // console.log(trans);
    this.firebase.addTrans(trans);
  }
}
