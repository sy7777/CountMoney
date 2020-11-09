import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillAnalysisComponent } from './components/bill-analysis/bill-analysis.component';
import { RecordBillComponent } from './components/record-bill/record-bill.component';
import { RegisterComponent } from './components/register/register.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { AuthGuard } from './guards/auth.guard';
import { NotLogInComponent } from './not-log-in/not-log-in.component';

const routes: Routes = [
  { path: '', redirectTo: 'transactions', pathMatch: 'full' },
  {
    path: 'cashbook',
    component: NotLogInComponent,
    data: { title: 'Cashbook', login: true,  hideTabBar: true},
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Register', hideTabBar: true},
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    data: { title: 'Transactions', calendar: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'record-bill',
    component: RecordBillComponent,
    data: { title: 'Record Bill', calendar: true },
  },
  {
    path: 'bill-analysis',
    component: BillAnalysisComponent,
    data: { title: 'Bill Analysis', calendar: true },
  },
  {
    path: 'user-account',
    component: UserAccountComponent,
    data: { title: 'User Account' },
  },
  { path: '**', redirectTo: 'transactions' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
