import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TransmitService {

  public info: any= 'serTime';
  public currentDate:any = new Date().getUTCMonth()+1;

  public infoSource = new Subject<string>();
  constructor(){}
  changeInfo(msg:any):void{
    this.infoSource.next(msg);
  }
  getPickTime(){
    return this.infoSource.asObservable();
  }

}
