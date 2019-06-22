import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) {}

  isActive(strUrl: string) {
    if (!strUrl || strUrl === '/') {
      return !this.router.url || this.router.url === '/';
    } else {
      return this.router.url.indexOf(strUrl) === 0;
    }
  }
}
