import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ImageService, Template} from "../image.service";
import {Options} from "@angular-slider/ngx-slider";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {
  options: Options = {
    floor: 0,
    ceil: 100,
    animate: true,
    ariaLabel: "Opacity",

  };
  opacity: number = 65;

  @ViewChild('canvas')
  canvasRef!: ElementRef;
  canvas?: HTMLCanvasElement;

  @ViewChild('uploadBtn')
  uploadBtn!: ElementRef;

  // If true, the svg in the button changes color.
  hover: boolean = false;

  ctx?: CanvasRenderingContext2D;
  selectedTemplate: Template;

  constructor(public imageService: ImageService) {
    this.selectedTemplate = Template.NORMAL_FLAG;
  }

  ngAfterViewInit(): void {
    this.imageService.finalImageData.subscribe(val => {
    });

    this.uploadBtn.nativeElement.onmouseover = () => {
      this.hover = true;
    }
    this.uploadBtn.nativeElement.onmouseleave = () => {
      this.hover = false;
    }

    this.canvas = this.canvasRef.nativeElement!;
    this.ctx = this.canvas!.getContext("2d")!;
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

  /**
   * Put both images into one canvas and then convert this canvas into a Base64 string which can be downloaded.
   */
  downloadImage() {
    if (this.imageService.imageData === undefined && this.selectedTemplate === undefined) {
      return;
    }

    let avatar = new Image();
    avatar.onload = () => {
      this.canvas!.height = avatar.height;
      this.canvas!.width = avatar.width;

      this.ctx?.drawImage(avatar, 0, 0);

      let templateOverlay = new Image();
      templateOverlay.onload = () => {
        this.ctx!.globalAlpha = this.opacity / 100;
        this.ctx?.drawImage(templateOverlay, 0, 0, avatar.width, avatar.height);

        this.canvas?.toBlob(blob => {
          if (blob === null) return;

          const objectURL = URL.createObjectURL(blob);

          const anchor = document.createElement('a');
          anchor.href = objectURL;
          anchor.download = "UkrainifyedAvatar.png";

          // Append to the DOM
          document.body.appendChild(anchor);

          // Trigger `click` event
          anchor.click();

          // Remove element from DOM
          document.body.removeChild(anchor);
        });
      }

      console.log("Use template:", this.selectedTemplate, "at", this.imageService.getTemplatePathByName(this.selectedTemplate));
      templateOverlay.src = this.imageService.getTemplatePathByName(this.selectedTemplate);
    }

    avatar.src = this.imageService.finalImageData.value!;
  }

  updateTemplate($event: Template) {
    this.selectedTemplate = $event;
  }
}
