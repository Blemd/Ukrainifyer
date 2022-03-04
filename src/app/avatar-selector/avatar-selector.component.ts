import { Component, OnInit } from '@angular/core';
import {ImageService} from "../image.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.css']
})
export class AvatarSelectorComponent implements OnInit {

  imageURL?: SafeResourceUrl;

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.imageService.finalImageData.subscribe(image => {
      if (image === "") return;

      console.debug("New image has been saved. Display ...");

      // Generate base64 url
      this.imageURL = this.sanitizer.bypassSecurityTrustResourceUrl(image);
    });

    this.imageURL = "assets/avatar.png";
  }

}
