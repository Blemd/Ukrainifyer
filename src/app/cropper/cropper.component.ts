import {Component, OnInit, ViewChild} from '@angular/core';
import {ImageCroppedEvent, ImageCropperComponent, LoadedImage} from "ngx-image-cropper";
import {ImageService} from "../image.service";

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css']
})
export class CropperComponent implements OnInit {

  @ViewChild(ImageCropperComponent)
  imageCropper!: ImageCropperComponent;

  image?: string;
  croppedImage: any = '';

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    this.image = this.imageService.imageData;
    console.log(this.croppedImage);
  }

  imageCropped(event: ImageCroppedEvent) {
    console.debug("Image cropped");
    if (event.base64 !== null) {
      if (event.base64 != null) {
        this.imageService.finalImageData.next(event.base64);

        // This will destroy this component
        this.imageService.showCropper.next(false);
      }
    }
  }

  loadImageFailed() {
    console.error("Loading the image failed for some reason.");
  }

  /**
   * User clicks on "Done" button
   */
  cropImage() {
    this.imageCropper.crop();
  }
}
