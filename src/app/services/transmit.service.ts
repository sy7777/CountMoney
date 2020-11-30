import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
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

  getPickTime() {
    return this.infoSource.asObservable();
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
