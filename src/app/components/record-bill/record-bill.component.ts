import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-record-bill',
  templateUrl: './record-bill.component.html',
  styleUrls: ['./record-bill.component.css']
})
export class RecordBillComponent implements OnInit {

  iconList = ['/assets/icons/cart.png', '/assets/icons/cloth.png'];
  gridData = [];
  data = Array.from(new Array(9)).map((_val, i) => ({
    icon: '/assets/icons/cart.png',
    text: `name${i}`
  }));

  click(event) {
    console.log(event);
  }

  constructor() {
    this.init();
  }

  ngOnInit(): void {
  }

  init() {
    const dataLength = (this.data && this.data.length) || 0;
    let rowCount = Math.ceil(dataLength / 3);
    this.gridData = this.getRows(rowCount, dataLength);
  }

  getRows(rowCount: number, dataLength: number) {
    const columnNum = 3;
    const rowArr = new Array();
    for (let i = 0; i < rowCount; i++) {
      rowArr[i] = new Array();
      for (let j = 0; j < columnNum; j++) {
        const dataIndex = i * columnNum + j;
        if (dataIndex < dataLength) {
          rowArr[i][j] = this.data[dataIndex];
        } else {
          rowArr[i][j] = null;
        }
      }
    }
    return rowArr;
  }
}
