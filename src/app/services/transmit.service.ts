import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TransmitService {

  public info: any;
  public currentDate:any = new Date().getUTCMonth()+1;

  public infoSource = new Subject<string>();
  constructor(){}
  changeInfo(msg:any):void{
    this.infoSource.next(msg);
  }
  getPickTime(){
    return this.infoSource.asObservable();
  }

  setTrans(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  getTrans(key){
    return JSON.parse(localStorage.getItem(key))
  }

  removeTrans(key){
    localStorage.removeItem(key);
  }

}
