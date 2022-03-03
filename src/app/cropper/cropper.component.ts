import { Component, OnInit } from '@angular/core';
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";
import {ImageService} from "../image.service";

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css']
})
export class CropperComponent implements OnInit {

  image?: string;
  croppedImage: any = '';

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    this.image = this.imageService.imageData;
    console.log(this.croppedImage);
  }

  imageCropped(event: ImageCroppedEvent) {
    console.debug("Image cropped");
  }

  imageLoaded(image: LoadedImage) {
    console.debug("Image has been loaded successfully.");
  }

  cropperReady() {
    console.debug("Cropper is ready!");
  }

  loadImageFailed() {
    console.error("Loading the image failed for some reason.");
  }

}
