import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import { ToastService } from 'ng-zorro-antd-mobile';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { TransListItem } from '../components/record-bill/record-bill.component';
import { Transfilter } from '../components/transactions/transactions.component';
import {
  User,
  UserFilter,
} from '../components/user-account/user-account.component';
import { UserTransIcon } from '../util/iconPath';
import { TransmitService } from './transmit.service';
import * as moment from 'moment';
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
        username: snapshot.data().username,
        des: snapshot.data().des,
      };
    },
    toFirestore: (user: User) => {
      return {
        userId: user.userId,
        avatar: user.avatar,
        username: user.username,
        des: user.des,
        password: user.password,
      };
    },
  };
  private readonly TIME_START = 'T00:00:00';
  private readonly TIME_END = 'T23:59:59.999';
  constructor(private _toast: ToastService, private service: TransmitService) {
    this.initialize();
  }
  getUsers(filter?: UserFilter) {
    let query: firebase.firestore.Query = this.fireStore
      .collection('users')
      .withConverter(this.userConverter);
    if (filter?.username) {
      query = query.where('username', '==', filter.username);
    }
    if (filter?.password) {
      query = query.where('password', '==', filter.password);
    }
    if (filter?.userId) {
      query = query.where('userId', '==', filter.userId);
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
  async delPreImg(url) {
    await this.fireStorage.refFromURL(url).delete();
  }
  async registerUser(user: UserFilter) {
    if (!(await this.identifyUser(user)).empty) {
      this._toast.offline('User Already Exists !!!', 3000);
      return false;
    }
    this.fireStore
      .collection('users')
      .doc(user.userId)
      .set(user)
      .then(() => {
        this._toast.success('Congraduation!!!', 3000);
      });
    return true;
  }
  async identifyUser(user: UserFilter) {
    return await this.fireStore
      .collection('users')
      .where('username', '==', user.username)
      .get();
  }
  async checkUserAuth(user: UserFilter) {
    return await this.fireStore
      .collection('users')
      .withConverter(this.userConverter)
      .where('username', '==', user.username)
      .where('password', '==', user.password)
      .get();
  }
  async checkIconExists(icon: UserTransIcon) {
    return await this.fireStore
      .collection('allicons')
      .where('icon', '==', icon.icon)
      .where('text', '==', icon.text)
      .where('index', '==', icon.index)
      .where('userId', '==', icon.userId)
      .get();
  }
  async updateUser(user: User) {
    await this.fireStore.collection('users').doc(user.userId).update(user);
    await this.syncToLocalstorage(user.userId);
  }
  getTransFromDB(userId, filter?: Transfilter) {
    let userQuery = this.fireStore
      .collection('trans')
      .where('userId', '==', userId);
    if (filter?.in) {
      userQuery = userQuery.where('type', '==', 'in');
    } else if (filter?.out) {
      userQuery = userQuery.where('type', '==', 'out');
    }
    if (filter?.startDate) {
      userQuery = userQuery.where(
        'time',
        '>=',
        new Date(
          `${moment(filter.startDate).format('YYYY-MM-DD')}${this.TIME_START}`
        )
      );
    }
    if (filter?.endDate) {
      userQuery = userQuery.where(
        'time',
        '<=',
        new Date(
          `${moment(filter.endDate).format('YYYY-MM-DD')}${this.TIME_END}`
        )
      );
    }

    return userQuery;
  }
  async syncToLocalstorage(userId) {
    const snapshot = await this.fireStore
      .collection('users')
      .withConverter(this.userConverter)
      .where('userId', '==', userId)
      .get();
    snapshot.forEach((doc) => {
      this.service.setTrans('users', doc.data());
    });
  }
  async addTrans(trans: TransListItem) {
    const dataTrans = await this.fireStore
      .collection('trans')
      .doc(`${trans.userId}-${trans.id}`)
      .set(trans);
  }
  async delTransItem(userId, id) {
    await this.fireStore.collection('trans').doc(`${userId}-${id}`).delete();
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
    firebase.auth().signInWithEmailAndPassword(environment.email, environment.password)
  }

  getImgFromDB() {
    const displayImgQuery = this.fireStore.collection('carousel');
    return displayImgQuery;
  }
  async addNewIconToCloud(usericon: UserTransIcon) {
    await this.fireStore
      .collection('allicons')
      .doc(`${usericon.userId}${usericon.id}`)
      .set(usericon);
  }
  getUserIconsFromDB(userId: string) {
    return this.fireStore.collection('allicons').where('userId', '==', userId);
  }
  async delUserIconFromDB(userId: string, id: string) {
    await this.fireStore.collection('allicons').doc(`${userId}${id}`).delete();
  }
}
