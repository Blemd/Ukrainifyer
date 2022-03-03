import { Component, OnInit } from '@angular/core';
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";
import {FileChangeEvent} from "@angular/compiler-cli/src/perform_watch";
import {ImageService} from "../image.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
  }

  openCropper(event: any) {
    let reader = new FileReader();

    reader.addEventListener("load", (e) => {
      this.imageService.imageData = e.target!.result as string;

      // This will show the cropper popover.
      this.imageService.showCropper.next(true);
    });

    reader.readAsDataURL(event.files[0]);
  }
}
