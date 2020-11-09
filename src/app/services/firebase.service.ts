import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { ToastService } from 'ng-zorro-antd-mobile';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  UserFilter,
} from '../components/user-account/user-account.component';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private fireStore: firebase.firestore.Firestore;
  private fireStorage: firebase.storage.Storage;
  private userConverter = {
    fromFirestore: (
      snapshot: firebase.firestore.QueryDocumentSnapshot,
      options: firebase.firestore.SnapshotOptions
    ) => {
      return {
        userId: snapshot.data().userId,
        avatar: snapshot.data().avatar,
        username: snapshot.data()['user-name'],
        des: snapshot.data().des,
      };
    },
    toFirestore: (user: User) => {
      return {
        userId: user.userId,
        avatar: user.avatar,
        username: user['user-name'],
        des: user.des,
        password: user.password,
      };
    },
  };

  constructor(private _toast: ToastService) {
    this.initialize();
  }
  getUsers(filter?: UserFilter) {
    let query: firebase.firestore.Query = this.fireStore
      .collection('users')
      .withConverter(this.userConverter);

    if (filter?.username) {
      query = query.where('user-name', '==', filter.username);
    }
    if (filter?.password) {
      query = query.where('password', '==', filter.password);
    }
    return query;
  }
  uploadFile(file) {
    const metadata = {
      contentType: 'image/jpeg',
    };
    return this.fireStorage
      .ref()
      .child(`${uuidv4()}.jpg`)
      .putString(file, 'data_url', metadata);
  }
  async registerUser(user: UserFilter) {
    if(!(await this.identifyUser(user)).empty){
      this._toast.offline('User Already Exists !!!', 3000);
      return false;
    }
    console.log(await this.identifyUser(user));
    this.fireStore
      .collection('users')
      .add(user)
      .then(() => {
        this._toast.success('Congraduation!!!', 3000);
        console.log('user added successfully');
      });
      return true;
  }
  async identifyUser(user: UserFilter) {
    return await this.fireStore
      .collection('users')
      .where('username', '==', user.username)
      .get();
  }
  private initialize() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: environment.apiKey,
        authDomain: environment.authDomain,
        databaseURL: environment.databaseURL,
        projectId: environment.projectId,
        storageBucket: environment.storageBucket,
      });
    }
    this.fireStore = firebase.firestore();
    this.fireStorage = firebase.storage();
  }
}
