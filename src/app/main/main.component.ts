import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {ImageService, Template, TemplateMasks} from "../image.service";
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

  @ViewChild('applyCircle')
  applyCircle!: ElementRef;

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
    this.uploadBtn.nativeElement.onmouseover = () => {
      this.hover = true;
    }
    this.uploadBtn.nativeElement.onmouseleave = () => {
      this.hover = false;
    }

    let previousOpacity = 0;
    setInterval(() => {
      if (previousOpacity != (this.opacity / 100)) {
        this.imageService.opacity.next(this.opacity / 100);
      }

      previousOpacity = this.imageService.opacity.value;
    }, 20);

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

  updateTemplate($event: Template) {
    this.selectedTemplate = $event;
  }

  updateMask(event: Event) {
    const elem = this.applyCircle.nativeElement as HTMLInputElement;
    this.imageService.mask.next(elem.checked ? TemplateMasks.CIRCLE_MASK : null);

    // This will trigger the render function in the preview component.
    this.imageService.opacity.next(this.opacity / 100);
  }

  reset() {
    this.imageService.isReset.next(true);
  }
}
