import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
interface Carousel {
  name: string;
  imgurl: string;
  des?: string;
}
@Component({
  selector: 'app-not-log-in',
  templateUrl: './not-log-in.component.html',
  styleUrls: ['./not-log-in.component.css'],
})
export class NotLogInComponent implements OnInit, OnDestroy {
  state: { data: string[]; imgHeight: string } = {
    data: [
      'https://firebasestorage.googleapis.com/v0/b/gigi-294903.appspot.com/o/account.png?alt=media&token=1a879a75-1fc2-41b6-8faa-77b8429479f1',
    ],
    imgHeight: '70vh',
  };
  cancelListening: any;
  des: string[] = [];
  currentDisplayDes: string;
  constructor(private firebase: FirebaseService) {}
  ngOnDestroy(): void {
    this.cancelListening();
  }

  ngOnInit(): void {
    this.getDisplayImg();
  }

  onClick1() {
    // this.state.data.push('AiyWuByWklrrUDlFignR');
  }
  beforeChange(event) {
    // console.log(event);
  }

  afterChange(event) {
    // console.log(event);
    this.currentDisplayDes = this.des[event]
  }

  getDisplayImg() {
    this.cancelListening = this.firebase.getImgFromDB().onSnapshot((snap) => {
      const carouselList = [];
      snap.forEach((doc) => {
        carouselList.push(doc.data());
      });
      this.state = {
        ...this.state,
        data: carouselList.map((value) => value.imgurl),
      };
      this.des = carouselList.map((value)=>value.des);
      this.currentDisplayDes = this.des[0]
    });
  }
}
