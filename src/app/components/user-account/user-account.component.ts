import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { ModalRef, ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TransmitService } from 'src/app/services/transmit.service';
import { TransListItem } from '../record-bill/record-bill.component';
const data = [];
export interface User {
  avatar?: string;
  username?: string;
  des?: string;
  password?: string;
  userId?: string;
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
  autoFocus = { focus: true, date: new Date() };
  constructor(
    private _modal: ModalService,
    private service: TransmitService,
    private firebase: FirebaseService,
    private _toast: ToastService
  ) {}
  ngOnDestroy(): void {
    if (this.unSubscribe) {
      this.unSubscribe();
    }
  }
  unSubscribe: any;
  files = data.slice(0);
  multiple = false;
  modalRef: ModalRef;
  user: User;
  imgUrl: string =
    'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg';
  username: string;
  userDescription: string;
  ngOnInit(): void {
    this.user = this.service.getTrans('users');
    // console.log(defaltuser);
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
            // await this.firebase.updateUser({
            //   userId:this.user.userId,
            //   username: this.username,
            //   des:this.userDescription
            // })
            this.user = this.service.getTrans('users');
          },
        },
      ],
      'default'
    );
    // console.log(tem);
  }
  inputChange(event) {
    // console.log(event);
  }
}
