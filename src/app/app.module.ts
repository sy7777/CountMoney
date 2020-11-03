import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { HeaderComponent } from './components/header/header.component';
import { TabMenuComponent } from './components/tab-menu/tab-menu.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { RecordBillComponent } from './components/record-bill/record-bill.component';
import { BillAnalysisComponent } from './components/bill-analysis/bill-analysis.component';
import { UserAccountComponent } from './components/user-account/user-account.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TabMenuComponent,
    TransactionsComponent,
    RecordBillComponent,
    BillAnalysisComponent,
    UserAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdMobileModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
