import { Component, OnInit } from '@angular/core';
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";
import {FileChangeEvent} from "@angular/compiler-cli/src/perform_watch";
import {ImageService} from "../image.service";
import {Options} from "@angular-slider/ngx-slider";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  options: Options = {
    floor: 0,
    ceil: 100,
    animate: true,
    ariaLabel: "Opacity",

  };
  opacity: number = 65;

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
