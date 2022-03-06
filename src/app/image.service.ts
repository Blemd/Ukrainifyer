import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {toDataURL} from "./helper";

export enum Template {
  NORMAL_FLAG = 0,
  HEART_FLAG = 1,
  PEACE_FLAG = 2,
  OUTER_CIRCLE_FLAG = 3,
  INNER_CIRCLE_FLAG = 4,
  CIRCLE_FLAG = 5
}

export enum TemplateMasks {
  CIRCLE_MASK,
  CIRCLE_MARGIN_MASK
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

  template: BehaviorSubject<Template>;
  mask: BehaviorSubject<TemplateMasks | null>;
  isReset: BehaviorSubject<boolean>;
  opacity: BehaviorSubject<number>;

  // When triggered, redraw your frame.
  redraw: BehaviorSubject<null>;

  constructor() {
    this.opacity = new BehaviorSubject<number>(0.5);
    this.template = new BehaviorSubject<Template>(Template.NORMAL_FLAG);
    this.mask = new BehaviorSubject<TemplateMasks | null>(null);
    this.isReset = new BehaviorSubject<boolean>(true);
    this.showCropper = new BehaviorSubject<boolean>(false);
    this.finalImageData = new BehaviorSubject<string>("");
    this.redraw = new BehaviorSubject<null>(null);

    this.opacity.subscribe(_ => this.redraw.next(null));
    this.template.subscribe(_ => this.redraw.next(null));
    this.mask.subscribe(_ => this.redraw.next(null));
    this.finalImageData.subscribe(_ => this.redraw.next(null));
    this.isReset.subscribe(status => {
      if (status) {
        toDataURL("assets/avatar.png").then(base64 => {
          this.finalImageData.next(base64);
        });
      }
    });
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
      case Template.CIRCLE_FLAG:
        return path + "circle-flag.png"
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
      case Template.CIRCLE_FLAG:
        return "Circle flag"
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

  getMaskPath(mask: TemplateMasks) {
    let path = "assets/templates/masks/";

    switch (mask) {
      case TemplateMasks.CIRCLE_MARGIN_MASK:
        return path + "circle-margin-mask.png"
      case TemplateMasks.CIRCLE_MASK:
        return path + "circle-mask.png"
      default:
        return path + "circle-mask.png"
    }
  }

  /**
   * This works by generating a temporary canvas which contains the mask data. Both target and the mask have the same
   * size. Now we iterate over each pixel in both mask and target. If the mask's pixel is black, we make the target's
   * pixel transparent.
   * @param target Canvas where to apply effect to.
   * @param mask Black & white image.
   * @private
   */
  private applyMask(target: CanvasRenderingContext2D, mask: HTMLImageElement): ImageData {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = target.canvas.width;
    tmpCanvas.height = target.canvas.height;

    // Draw mask into temp canvas
    const tmpCtx = tmpCanvas.getContext("2d")!;
    tmpCtx.drawImage(mask, 0, 0, target.canvas.width, target.canvas.height);

    // return tmpCtx.getImageData(0, 0, target.canvas.width, target.canvas.width,{ colorSpace: 'srgb' });

    // Loop over each pixel in both canvas and mask
    const targetData = target.getImageData(0, 0, target.canvas.width, target.canvas.width,{ colorSpace: 'srgb' });
    const maskData = tmpCtx.getImageData(0, 0, tmpCtx.canvas.width, tmpCtx.canvas.width,{ colorSpace: 'srgb' }).data;

    for (let i = 0; i < targetData.data.length; i += 4) {
      //console.log(targetData[i], targetData[i + 1], targetData[i + 2], targetData[i + 3]);
      //console.log(maskData[i], maskData[i + 1], maskData[i + 2], maskData[i + 3]);
      //console.log("------");

      // This method preserves smooth edges.
      if (maskData[i] < 255 && maskData[i + 3] <= 255) {
        const diff = 255 - maskData[i + 3];
        targetData.data[i + 3] = diff;
      }
    }

    return targetData;
  }

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve(img);
      }

      img.onerror = (err) => {
        reject(err);
      }

      img.src = src;
    });
  }

  /**
   * Put both images into one canvas and then convert this canvas into a Base64 string which can be downloaded.
   */
  async renderImage(size?: number): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>(async (resolve, reject) => {
      if (this.finalImageData.value === "") {
        reject("Cannot render canvas if no image is selected!")
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      let avatar = await this.loadImage(this.finalImageData.value!);
      let templateOverlay = await this.loadImage(this.getTemplatePathByName(this.template.value));
      let maskImage = await this.loadImage(this.getMaskPath(this.mask.value || TemplateMasks.CIRCLE_MARGIN_MASK));

      // Since we are working with 1:1 images, it doesn't matter what size to choose.
      if (size === undefined) size = avatar.width;

      canvas.height = size;
      canvas.width = size;

      ctx.drawImage(avatar, 0, 0, size, size);

      // Apply mask to avatar
      if (this.mask.value !== null) {
        ctx.putImageData(this.applyMask(ctx, maskImage), 0, 0);
      }

      // Create temp canvas for template overlay
      const templateCanvas = document.createElement("canvas");
      templateCanvas.width = avatar.width;
      templateCanvas.height = avatar.height;

      const templateCtx = templateCanvas.getContext("2d")!;
      templateCtx.drawImage(templateOverlay, 0, 0, avatar.width, avatar.height);

      // Force specify mask on circle template
      if (this.template.value == Template.CIRCLE_FLAG) {
        let forceMask = await this.loadImage(this.getMaskPath(TemplateMasks.CIRCLE_MARGIN_MASK));
        ctx.putImageData(this.applyMask(ctx, forceMask), 0, 0);

        ctx.drawImage(templateCtx.canvas, 0, 0, size, size);
      } else {
        // Apply mask to avatar
        if (this.mask.value !== null) {
          templateCtx.putImageData(this.applyMask(templateCtx, maskImage), 0, 0);
        }

        ctx.globalAlpha = this.opacity.value;
        ctx.drawImage(templateCtx.canvas, 0, 0, canvas.width, canvas.height);
      }


      // Draw overlay onto final image

      resolve(canvas);
    });
  }

  async downloadImage() {
    const canvas = await this.renderImage();
    canvas.toBlob(blob => {
      if (blob === null) return;

      const objectURL = URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = "Ukrainifyed-Avatar.png";

      // Append to the DOM
      document.body.appendChild(anchor);

      // Trigger `click` event
      anchor.click();

      // Remove element from DOM
      document.body.removeChild(anchor);
    });
  }
}
