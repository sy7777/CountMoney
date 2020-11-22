import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import {
  ActionSheetService,
  ModalRef,
  ModalService,
  ToastService,
} from 'ng-zorro-antd-mobile';
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
  UserTransIcon,
  addIcon,
} from 'src/app/util/iconPath';
import { fadeInDown, fadeOutUp } from 'src/app/util/animations';
export interface TransListItem {
  userId?: string;
  icon?: string;
  text?: string;
  amount?: number;
  time?: Date;
  id?: string;
  type?: string;
}
@Component({
  selector: 'app-record-bill',
  templateUrl: './record-bill.component.html',
  styleUrls: ['./record-bill.component.css'],
  animations: [fadeInDown, fadeOutUp],
})
@UntilDestroy()
export class RecordBillComponent implements OnInit, OnDestroy {
  public index: number = 0;
  public pickIcon: TransIcon;
  public defaultIcon: string = 'assets/icons/expense.png';
  public currentUser: User;
  startDate: Date;
  endDate: Date;
  public iconPageList = Array.from(new Array(iconPaths.length)).map(
    (_val, i) => ({
      icon: `${iconPaths[i].icon}`,
      text: `${iconPaths[i].text}`,
    })
  );
  public visible: boolean = false;
  public pickPageIconData: TransIcon | UserTransIcon;
  public displayIconHtmlName: string;
  afterAddInIconList: TransIcon[] = [];
  afterAddOutIconList: TransIcon[] = [];
  unsubscribe: any;
  modalRef: any;
  public icontext;
  public pickUserIcon: UserTransIcon;

  constructor(
    private _toast: ToastService,
    private _modal: ModalService,
    private service: TransmitService,
    private firebase: FirebaseService,
    private _actionSheet: ActionSheetService
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe();
  }
  async ngOnInit() {
    this.startDate = this.service.dateRange?.startDate;
    this.endDate = this.service.dateRange?.endDate;
    this.service
      .getPickTime()
      .pipe(untilDestroyed(this))
      .subscribe((msg) => {
        this.startDate = msg?.startDate;
        this.endDate = msg?.endDate;
      });
    this.currentUser = this.service.getTrans('users');
    this.loadUserIcons();
  }
  alertAction(tem: TemplateRef<any>) {
    let BUTTONS, destructiveButtonIndex, allActionIndex;
    if ((this.pickIcon as UserTransIcon).userId) {
      BUTTONS = ['Record this bill', 'Update the name', 'Delete', 'Cancel'];
      destructiveButtonIndex = BUTTONS.length - 2;
    } else {
      BUTTONS = ['Record this bill', 'Cancel'];
      destructiveButtonIndex = BUTTONS.length - 1;
    }
    allActionIndex = BUTTONS.length;
    this._actionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: destructiveButtonIndex,
        title: 'Choose Your Action',
        maskClosable: true,
      },
      (buttonIndex) => {
        if (!buttonIndex) {
          this.recordBillAction();
        }
        if (buttonIndex === 1 && allActionIndex > 2) {
          this.updateIconName(tem);
        }
        if (buttonIndex === 1 && allActionIndex === 2) {
          close();
        }
        if (buttonIndex === 2) {
          this.delUserIcon();
        }
      }
    );
  }

  recordBillAction() {
    const ref: ModalRef = this._modal.prompt(
      'Enter Amount',
      `You spent money on: ${this.pickIcon.text || ''}`,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Submit',
          onPress: (value) => {
            return new Promise((res, rej) => {
              if (!isNaN(parseFloat(value))) {
                let trans: TransListItem;
                let amount;
                if (this.index === 0) {
                  amount = -parseFloat(value);
                }
                if (this.index === 1) {
                  amount = parseFloat(value);
                }
                trans = {
                  text: this.pickIcon.text,
                  userId: this.currentUser.userId,
                  time: this.startDate || new Date(),
                  id: uuidv4(),
                  amount: amount,
                  icon: this.pickIcon.icon,
                  type: this.index ? 'in' : 'out',
                };

                this.saveTransToCloud(trans);
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
  updateIconName(tem: TemplateRef<any>) {
    this.modalRef = this._modal.alert(
      'Edit Your Icon Name',
      tem,
      [
        { text: 'Cancel' },
        {
          text: 'Submit',
          onPress: () => {
            let userIconList = [];
            this.firebase
              .getUserIconsFromDB(this.pickUserIcon.userId)
              .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                  const userIcons = doc.data();
                  userIconList.push(userIcons);
                  let usericon: UserTransIcon;
                  if (this.icontext) {
                    usericon = {
                      icon: this.pickUserIcon.icon,
                      text: this.icontext,
                      id: this.pickUserIcon.id,
                      index: this.pickUserIcon.index,
                      userId: this.pickUserIcon.userId,
                    };
                    this.firebase.addNewIconToCloud(usericon);
                  } else {
                    this._toast.offline("You don't enter anything...", 3000);
                  }
                  // this.icontext = "";
                });
              });
          },
        },
      ],
      'default'
    );
  }
  async delUserIcon() {
    await this.firebase.delUserIconFromDB(
      (this.pickIcon as UserTransIcon).userId,
      (this.pickIcon as UserTransIcon).id
    );
  }

  onTabClick(item) {
    this.index = item.index;
  }
  onChange(item) {
    this.index = item.index;
  }
  showIconPage() {
    this.visible = true;
  }
  closeIconPage() {
    this.visible = false;
  }
  loadUserIcons() {
    this.unsubscribe = this.firebase
      .getUserIconsFromDB(this.currentUser.userId)
      .onSnapshot((snapshot) => {
        const userIconList = [];
        snapshot.forEach((doc) => {
          userIconList.push(doc.data());
        });
        this.afterAddInIconList = [
          ...defaultInIcon,
          ...userIconList.filter((userIcon) => userIcon.index),
          addIcon,
        ];
        this.afterAddOutIconList = [
          ...defaultOutIcon,
          ...userIconList.filter((userIcon) => !userIcon.index),
          addIcon,
        ];
      });
  }
  async submitIconPage() {
    if (!this.pickPageIconData) {
      this._toast.offline('Please add a icon or cancel it');
    } else {
      const pickCheckOne: UserTransIcon = {
        ...this.pickPageIconData,
        index: this.index,
        userId: '',
        id: '',
      };
      const res = await this.firebase.checkIconExists(pickCheckOne);
      if (res.empty) {
        const checkDefalut = defaultOutIcon.find((item) => {
          if (
            item.icon === this.pickPageIconData.icon &&
            item.text === this.pickPageIconData.text
          ) {
            return item;
          }
        });
        if (checkDefalut === undefined) {
          this.visible = false;
          const userIcon: UserTransIcon = {
            ...this.pickPageIconData,
            id: uuidv4(),
            userId: this.currentUser.userId,
            index: this.index,
          };
          this.firebase.addNewIconToCloud(userIcon);
          this.pickIcon.icon = undefined;
        } else {
          this._toast.offline(
            'Already have, please renew the name or choose a new icon!',
            3000
          );
        }
      } else {
        this._toast.offline(
          'Already have, please renew the name or choose a new icon!',
          3000
        );
      }
    }
  }
  editPageIconName(tem) {
    this.modalRef = this._modal.alert(
      'Edit Your Icon Name',
      tem,
      [
        { text: 'Cancel' },
        {
          text: 'Submit',
          onPress: () => {
            this.displayIconHtmlName = this.icontext;
          },
        },
      ],
      'default'
    );
  }
  click(event) {
    this.pickPageIconData = { ...event.data };
    this.displayIconHtmlName = event.data.text;
  }

  showPromptDefault(event, tem: TemplateRef<any>) {
    if (event.data.add) {
      this.showIconPage();
    } else {
      this.pickIcon = event.data;
      this.pickUserIcon = this.pickIcon as UserTransIcon;
      this.alertAction(tem);
    }
  }
  saveTransToCloud(trans: TransListItem) {
    this.firebase.addTrans(trans);
  }
  inputChange(event) {}
}
