import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TransmitService {

  public info: any= 'serTime';
  public currentDate:any = new Date().getUTCMonth()+1;


  public infoSource = new BehaviorSubject<string>(this.currentDate);
  constructor(){}
  changeInfo(msg:any):void{
    this.infoSource.next(msg);
  }

}
