import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
@UntilDestroy()
export class AppComponent implements OnInit {
  hideTab: boolean;
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => {
          return route?.firstChild;
        }),
        mergeMap((route) => route?.data)
      )
      .subscribe((data) => {
        this.hideTab = data.hideTabBar;
      });
  }
}
