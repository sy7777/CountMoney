
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { User, UserFilter } from '../components/user-account/user-account.component';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private fireStore: firebase.firestore.Firestore;
  private fireStorage: firebase.storage.Storage;
  private userConverter= {
    fromFirestore:(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions)=>{
      return {userId: snapshot.data().userId,
        avatar: snapshot.data().avatar,
        "user-name": snapshot.data()["user-name"],
        des:snapshot.data().des,
       }
    },
    toFirestore: (user: User) => {
        return {
            userId: user.userId,
            avatar: user.avatar,
            "user-name": user["user-name"],
            des:user.des,
            password:user.password
        }
    }

  }
  constructor() {
    this.initialize();
  }
  getUsers(filter?:UserFilter) {
    let query: firebase.firestore.Query =  this.fireStore.collection('users').withConverter(this.userConverter);

    if(filter?.userName){
      query = query.where("user-name","==", filter.userName);
    }
    if(filter?.password){
      query = query.where("password","==", filter.password);
    }
    return query;
  }
  uploadFile(file) {
    const metadata = {
      contentType: 'image/jpeg',
    };
    return this.fireStorage.ref().child(`${uuidv4()}.jpg`).putString(file,  'data_url',metadata);
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
