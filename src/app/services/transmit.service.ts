import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of, interval } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TransmitService {
  public dateRange: { startDate: Date; endDate: Date };
  public currentDate: any = new Date().getUTCMonth() + 1;
  public infoSource = new Subject<any>();

  constructor() {}
  changeInfo(msg: any): void {
    this.dateRange = msg;
    this.infoSource.next(msg);
  }
  getUserId(){
    return of("123");
  }
  getUserBank(id:string){
    return of(`${id}debank`);
  }
  getUserBanlance(bankID:string){
    return of(`${bankID}balance is 100`);
  }
  getPickTime() {
    return this.infoSource.asObservable();
  }

  mock(){
    return interval(1000)
  }

  setTrans(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getTrans(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  removeTrans(key) {
    localStorage.removeItem(key);
  }
}
