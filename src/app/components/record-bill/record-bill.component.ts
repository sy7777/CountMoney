import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
import {
  fadeInDownOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
} from 'angular-animations';
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
  animations: [fadeInDownOnEnterAnimation(), fadeOutUpOnLeaveAnimation()],
})
@UntilDestroy()
export class RecordBillComponent implements OnInit, OnDestroy {
  public iniconList: TransIcon[];
  public outiconList: TransIcon[];
  public index = 0;
  public pickIcon: TransIcon;
  public defaultIcon: string = 'assets/icons/expense.png';
  public currentUser: User;
  public transList: TransListItem[] = [];
  public time: string;
  public iconPageList = Array.from(new Array(iconPaths.length)).map(
    (_val, i) => ({
      icon: `${iconPaths[i].icon}`,
      text: `${iconPaths[i].text}`,
    })
  );
  actionIndex: number = 0;
  public state = { modal1: false };
  public visible: boolean = false;
  // public pickPageIconData: {data: TransIcon[], index: number};
  public pickPageIconData: TransIcon;
  displayIconHtmlName: string;
  afterAddInIconList: TransIcon[] = [];
  afterAddOutIconList: TransIcon[] = [];
  unsubscribe: any;
  modalRef: any;
  icontext: string;
  autoFocus = { focus: true, date: new Date() };
  cancelListeningUserIcons:any;
  pickUserIcon;
  @ViewChild('update') updateRef: TemplateRef<any>;
  constructor(
    private _toast: ToastService,
    private _modal: ModalService,
    private service: TransmitService,
    private firebase: FirebaseService,
    private _actionSheet: ActionSheetService
  ) {

  }

  ngOnDestroy(): void {
    this.unsubscribe();
    // this.cancelListeningUserIcons();
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
    this.loadUserIcons();
  }
  alertAction(tem: TemplateRef<any>) {
    const BUTTONS = ['Record this bill', 'Update the name', 'Delete', 'Cancel'];
    this._actionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        title: 'Choose Your Action',
        maskClosable: true,
      },
      (buttonIndex) => {
        this.actionIndex = buttonIndex;
        // console.log(buttonIndex);
        if (!buttonIndex) {
          this.recordBillAction();
        }
        if (buttonIndex === 1) {
          console.log('true');
          this.updateIconName(tem);
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
                  time: this.time || new Date().toDateString(),
                  id: uuidv4(),
                  amount: amount,
                  icon: this.pickIcon.icon,
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
            // let userIcon: UserTransIcon = {
            //   ...this.pickIcon,
            // };
            this.pickUserIcon = { ...this.pickIcon };
            console.log(this.pickUserIcon);
            // this.cancelListeningUserIcons = this.firebase
            this.firebase
              .getUserIconsFromDB(this.pickUserIcon.userId)
              .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                  const userIcons = doc.data();
                  // if(userIcons.text === this.pickUserIcon.text && userIcons.icon === this.pickUserIcon.icon){
                  //   this._toast.offline("Sorry the name and icon have already exists. Please choose a new icon or a new name!")
                  //   console.log("重复进来了");
                  // }else{
                    console.log("进来了");
                    let usericon: UserTransIcon = {
                      icon: this.pickUserIcon.icon,
                      text: this.icontext,
                      id: this.pickUserIcon.id,
                      index: this.pickUserIcon.index,
                      userId: this.pickUserIcon.userId,
                    };
                    console.log(this.icontext);
                    this.firebase.addNewIconToCloud(usericon);
                  // }
                  // console.log(userIcons);
                });
              });
          },
        },
      ],
      'default'
    );
  }
  async delUserIcon() {
    this.pickUserIcon = { ...this.pickIcon };
    // console.log(this.pickUserIcon.id, this.pickUserIcon);
    await this.firebase.delUserIconFromDB(
      this.pickUserIcon.userId,
      this.pickUserIcon.id
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
  submitIconPage() {

    if (!this.pickPageIconData) {
      this._toast.offline('Please add a icon or cancel it');
    } else {
      console.log(this.pickPageIconData);
      // if(this.index === 0 && this.pickPageIconData.icon === ){
      if(this.index === 0){
        this.loadUserIcons();
        // console.log(this.afterAddOutIconList);
        const duplicateIcon = this.afterAddOutIconList.filter(item=>{
          // item.text === defaultOutIcon.text;
          // console.log(value);
        })
        console.log(duplicateIcon);
        // console.log(KeyObject(this.afterAddInIconList));
      }
      this.visible = false;
      const userIcon: UserTransIcon = {
        ...this.pickPageIconData,
        id: uuidv4(),
        userId: this.currentUser.userId,
        index: this.index,
      };
      this.firebase.addNewIconToCloud(userIcon);
    }
  }

  click(event) {
    this.pickPageIconData = event.data;
    this.displayIconHtmlName = event.data.text;
    console.log(this.pickPageIconData);
  }

  showPromptDefault(event) {
    if (event.data.add) {
      this.showIconPage();
    } else {
      this.pickIcon = event.data;
      this.alertAction(this.updateRef);
    }
  }
  saveTransToCloud(trans: TransListItem) {
    this.firebase.addTrans(trans);
  }
  inputChange(event) {
    // console.log(event);
  }
}
