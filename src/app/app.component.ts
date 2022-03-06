import { Component } from '@angular/core';
import {ImageService} from "./image.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ukrainifyer';
  isMain: boolean = false;

  constructor(public imageService: ImageService, private router: Router) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.isMain = event.url === "/";
      }
    })
  }
}
