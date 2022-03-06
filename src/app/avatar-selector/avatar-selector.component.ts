import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ImageService, Template, TemplateMasks} from "../image.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {toDataURL} from "../helper";

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.css']
})
export class AvatarSelectorComponent implements OnInit {

  PREVIEW_SIZE = 256;

  @Input()
  overlayOpacity: number = 0.5;

  @Output()
  selectedTemplate: EventEmitter<Template>;
  overlayIndex: number = 0;
  overlayName?: string;

  @ViewChild("preview")
  canvas!: ElementRef;

  imageURL?: SafeResourceUrl;
  overlaySrc?: string;

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer) {
    this.selectedTemplate = new EventEmitter<Template>();
    this.selectedTemplate.next(Template.NORMAL_FLAG);
  }

  ngOnInit(): void {
    this.overlaySrc = this.imageService.getTemplatePathByName();
    this.overlayName = this.imageService.getTemplateName();

    this.imageService.redraw.subscribe(_ => {
      this.updatePreview().catch(err => {
        // Suppress
      });
    });
  }

  private async updatePreview() {
    const newCanvas = await this.imageService.renderImage(this.PREVIEW_SIZE);
    const data = newCanvas.getContext("2d")!.getImageData(0, 0, this.PREVIEW_SIZE, this.PREVIEW_SIZE);

    let canvas = this.canvas.nativeElement as HTMLCanvasElement;
    canvas.getContext("2d")!.putImageData(data, 0, 0);
  }

  private update() {
    let template = this.imageService.getTemplatePathByIndex(this.overlayIndex);
    this.imageService.template.next(template);
    this.selectedTemplate.emit(template);

    this.overlaySrc = this.imageService.getTemplatePathByName(template);
    this.overlayName = this.imageService.getTemplateName(template);

    this.updatePreview();
  }

  previous() {
    this.overlayIndex--;

    if (this.overlayIndex < 0) {
      this.overlayIndex = this.imageService.getTemplateAmount();
    }

    this.update();
  }

  next() {
    this.overlayIndex++;

    if (this.overlayIndex > this.imageService.getTemplateAmount()) {
      this.overlayIndex = 0;
    }

    this.update();
  }
}
