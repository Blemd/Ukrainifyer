import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

export enum Template {
  NORMAL_FLAG
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  showCropper: BehaviorSubject<boolean>;

  // Holds original selected image file as Base64.
  imageData?: string;

  // Holds final (cropped) image file as Base64.
  finalImageData: BehaviorSubject<string>;

  template?: Template;
  opacity: number;

  constructor() {
    this.opacity = 0.5;
    this.showCropper = new BehaviorSubject<boolean>(false);
    this.finalImageData = new BehaviorSubject<string>("");
  }
}
