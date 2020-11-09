import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { ModalRef, ModalService } from 'ng-zorro-antd-mobile';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TransmitService } from 'src/app/services/transmit.service';
const data = [];
export interface User {
  avatar: string;
  username: string;
  des: string;
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
    private firebase: FirebaseService
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
  user: User = {
    avatar: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
    username: 'Fred',
    des: 'I am a handsome boy, call me have a chat!',
  };
  imgUrl: string =
    'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg';
  ngOnInit(): void {
    const defaltuser = this.service.getTrans('users');
    // console.log(defaltuser);
    if (defaltuser instanceof Array) {
      this.service.setTrans('users', this.user);
      console.log('true');
    } else {
      // console.log('wrong');
    }
    this.unSubscribe = this.firebase.getUsers().onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        // console.log(doc.data());
      });
    });
  }

  fileChange(params) {
    // console.log(params);
    const { files, type, index } = params;
    this.files = files;
    this.user.avatar = this.files[0].url;
    // this.service.setTrans("user-avatar",this.files[0].url);
    this.service.setTrans('users', this.user);
    this.imgUrl = this.files[0].url;
    this.firebase.uploadFile(this.files[0].url).then(async (res) => {
      // console.log(await res.ref.getDownloadURL());
    });
  }
  showUploadImg(tem: TemplateRef<any>) {
    this.modalRef = this._modal.alert(tem, undefined, [
      { text: 'Close', onPress: () => this.modalRef?.close() },
    ]);
    // console.log(tem);
  }
  editProfile(tem: TemplateRef<any>){
    this.modalRef = this._modal.alert( 'Edit Your Profile',tem,
       [{ text: 'Cancel' },{ text: 'Submit', onPress: (value) => {

       } },
    ],'default');
    // console.log(tem);
  }
  inputChange(event){
    console.log(event);
  }
  showPromptDefault() {
    this._modal.prompt(
      'Edit Your Profile',
      'defaultValue for prompt',
      [{ text: 'Cancel' }, { text: 'Submit', onPress: value => console.log(`输入的内容:${value}`) }],
      'default',
      ['100']
    );
  }
}
