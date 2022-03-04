import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

export enum Template {
  NORMAL_FLAG = 0,
  HEART_FLAG = 1,
  PEACE_FLAG = 2,
  OUTER_CIRCLE_FLAG = 3,
  INNER_CIRCLE_FLAG = 4
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

  getTemplatePathByName(template?: Template) {
    let path = "assets/templates/";

    switch (template) {
      case Template.NORMAL_FLAG:
        return path + "normal-flag.png"
      case Template.HEART_FLAG:
        return path + "heart-flag.png"
      case Template.PEACE_FLAG:
        return path + "peace-flag.png"
      case Template.OUTER_CIRCLE_FLAG:
        return path + "outer-circle-flag.png"
      case Template.INNER_CIRCLE_FLAG:
        return path + "inner-circle-flag.png"
      default:
        return path + "normal-flag.png";
    }
  }

  getTemplateName(template?: Template) {
    switch (template) {
      case Template.NORMAL_FLAG:
        return "Normal flag"
      case Template.HEART_FLAG:
        return "Heart flag";
      case Template.PEACE_FLAG:
        return "Peace flag";
      case Template.OUTER_CIRCLE_FLAG:
        return "Round corners";
      case Template.INNER_CIRCLE_FLAG:
        return "Round flag"
      default:
        return "Normal flag";
    }
  }

  getTemplatePathByIndex(index: number): Template {
    let name = Template[index];

    // @ts-ignore: Please ignore this abnormality. It's JavaScript after all, what do you expect?
    return Template[name];
  }

  getTemplateAmount(): number {
    // Divided by two because this functions returns both keys & values (for some reason). The minus one because we start
    // counting at zero.
    return Object.keys(Template).length / 2 - 1;
  }
}
