// import { addIcon } from './../../util/iconPath';

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActionSheetService, ModalRef, ModalService, ToastService } from 'ng-zorro-antd-mobile';
// import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
// import { TransmitService } from 'src/app/services/transmit.service';
// import { v4 as uuidv4 } from 'uuid';
// import { User } from '../user-account/user-account.component';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import {
//   defaultInIcon,
//   defaultOutIcon,
//   iconPaths,
//   TransIcon,
//   UserTransIcon,
// } from 'src/app/util/iconPath';
// import { fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation } from 'angular-animations';
// export interface TransListItem {
//   userId?: string;
//   icon?: string;
//   text?: string;
//   amount?: number;
//   time?: string;
//   id?: string;
// }

// @Component({
//   selector: 'app-record-bill',
//   templateUrl: './record-bill1.component.html',
//   styleUrls: ['./record-bill.component.css'],
//   animations: [fadeInDownOnEnterAnimation(), fadeOutUpOnLeaveAnimation()],
// })
// @UntilDestroy()
// export class RecordBillComponent1 implements OnInit, OnDestroy {
//   public iniconList: TransIcon[];
//   public outiconList: TransIcon[];
//   public index = 0;
//   public pickIcon: TransIcon;
//   public defaultIcon: string = 'assets/icons/expense.png';
//   public currentUser: User;
//   public transList: TransListItem[] = [];
//   public time: string;
//   public iconPageList = Array.from(new Array(iconPaths.length)).map(
//     (_val, i) => ({
//       icon: `${iconPaths[i].icon}`,
//       text: `${iconPaths[i].text}`,
//     })
//   );
//   public state = { modal1: false };
//   public visible: boolean = false;
//   // public pickPageIconData: {data: TransIcon[], index: number};
//   public pickPageIconData: TransIcon;
//   pickIconName:string;
//   afterAddInIconList: TransIcon[] = [];
//   afterAddOutIconList: TransIcon[] = [];
//     unsubscribe: any;
//   constructor(
//     private _toast: ToastService,
//     private _modal: ModalService,
//     private service: TransmitService,
//     private firebase: FirebaseService,
//     private _actionSheet: ActionSheetService
//   ) {

//   }
//   ngOnDestroy(): void {
//    this.unsubscribe();
//   }
//   async ngOnInit() {
//     this.service
//       .getPickTime()
//       .pipe(untilDestroyed(this))
//       .subscribe((msg) => {
//         this.time = msg;
//         console.log(this.time);
//       });
//     this.currentUser = this.service.getTrans('users');
//     this.loadUserIcons()
//   }
//   alertAction(){
//     const BUTTONS = ['Record this bill', 'Update the name', 'Delete', 'Cancel'];
//     this._actionSheet.showActionSheetWithOptions(
//       {
//         options: BUTTONS,
//         cancelButtonIndex: BUTTONS.length - 1,
//         destructiveButtonIndex: BUTTONS.length - 2,
//         title: 'Choose Your Action',
//         maskClosable: true
//       },
//       buttonIndex => {
//         console.log(buttonIndex);
//       }
//     );
//   }
//   onTabClick(item) {
//     this.index = item.index;
//   }
//   onChange(item) {
//     this.index = item.index;
//   }
//   showIconPage() {
//     this.visible = true;
//   }
//   closeIconPage() {
//     this.visible = false;
//   }

//   loadUserIcons(){
//     this.unsubscribe = this.firebase.getUserIcons(this.currentUser.userId).onSnapshot(snapshot=>{
//       const userIconList = [];
//       snapshot.forEach(doc=>{
//         userIconList.push(doc.data())
//       })
//       this.afterAddInIconList = [...defaultInIcon, ...userIconList.filter(userIcon => userIcon.index), addIcon];
//       this.afterAddOutIconList = [...defaultOutIcon, ...userIconList.filter(userIcon => !userIcon.index), addIcon];
//     })
//   }
//   submitIconPage(){
//     if(!this.pickPageIconData){
//       this._toast.offline("Please add a icon or cancel it")
//     }else{
//       this.visible = false;
//         const userIcon: UserTransIcon = {...this.pickPageIconData, id: uuidv4(), userId: this.currentUser.userId, index: this.index}
//         this.firebase.addNewIconToCloud(userIcon)
//     }
//   }

//   click(event) {
//     this.pickPageIconData = event.data;
//     this.pickIconName= event.data.text;
//   }
//   delUserIcon(){
//     console.log("delete icon");

//   }
//   showPromptDefault(event) {
//     if (event.data.add) {
//       this.showIconPage();
//     } else {
//       this.alertAction()
//       // this.pickIcon = event.data;
//       // const ref: ModalRef = this._modal.prompt(
//       //   'Enter Amount',
//       //   `You spent money on: ${event.data.name||""}`,
//       //   [
//       //     {
//       //       text: 'Cancel',
//       //       onPress: () => {
//       //         this.delUserIcon();
//       //       },
//       //     },
//       //     {
//       //       text: 'Delete',
//       //       onPress: () => {
//       //         this.pickIcon = undefined;
//       //       },
//       //     },
//       //     {
//       //       text: 'Submit',
//       //       onPress: (value) => {
//       //         return new Promise((res, rej) => {
//       //           if (!isNaN(parseFloat(value))) {
//       //             let trans: TransListItem;
//       //             let amount;
//       //             if (this.index === 0) { amount = -parseFloat(value);}
//       //             if (this.index === 1) { amount = parseFloat(value); }
//       //             trans = {
//       //               text: event.data.text,
//       //               userId: this.currentUser.userId,
//       //               time: this.time || new Date().toDateString(),
//       //               id: uuidv4(),
//       //               amount: amount,
//       //               icon: event.data.icon,
//       //             };
//       //             this.saveTransToCloud(trans);
//       //             this.pickIcon = undefined;
//       //             res();
//       //           } else {
//       //             this._toast.offline('Please Enter a Number!', 3000);
//       //           }
//       //         });
//       //       },
//       //     },
//       //   ],
//       //   'default'
//       // );
//       // ref.triggerOk = undefined;
//     }
//   }
//   saveTransToCloud(trans: TransListItem) {
//     this.firebase.addTrans(trans);
//   }
// }
