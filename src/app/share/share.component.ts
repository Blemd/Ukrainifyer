import { Component, OnInit } from '@angular/core';
import {ImageService} from "../image.service";

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  constructor(private image: ImageService) { }

  ngOnInit(): void {
  }

  close() {
    this.image.showFeedback.next(false);
  }

  tweet() {
    this.image.track.action('f0816d10-e7bc-40bb-8059-11dcd655cca3', { key: 'Click', value: 1 });
  }

  email() {
    this.image.track.action('ec3f0bb1-17f0-4155-85cc-5990dae2c231', { key: 'Click', value: 1 });
  }
}
