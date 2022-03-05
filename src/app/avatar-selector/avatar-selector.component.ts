import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageService, Template} from "../image.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.css']
})
export class AvatarSelectorComponent implements OnInit {

  @Input()
  overlayOpacity: number = 0.5;

  @Output()
  selectedTemplate: EventEmitter<Template>;
  overlayIndex: number = 0;
  overlayName?: string;

  imageURL?: SafeResourceUrl;
  overlaySrc?: string;

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer) {
    this.selectedTemplate = new EventEmitter<Template>();
    this.selectedTemplate.next(Template.NORMAL_FLAG);
  }

  ngOnInit(): void {
    this.overlaySrc = this.imageService.getTemplatePathByName();
    this.overlayName = this.imageService.getTemplateName();

    this.imageService.finalImageData.subscribe(image => {
      if (image === "") return;

      console.debug("New image has been saved. Display ...");

      // Generate base64 url
      this.imageURL = this.sanitizer.bypassSecurityTrustResourceUrl(image);
    });

    this.imageURL = "assets/avatar.png";
  }

  private updateOverlay() {
    let template = this.imageService.getTemplatePathByIndex(this.overlayIndex);
    console.log(template);
    this.selectedTemplate.emit(template);

    this.overlaySrc = this.imageService.getTemplatePathByName(template);
    this.overlayName = this.imageService.getTemplateName(template);
  }

  previous() {
    this.overlayIndex--;

    if (this.overlayIndex < 0) {
      this.overlayIndex = this.imageService.getTemplateAmount();
    }

    this.updateOverlay();
  }

  next() {
    this.overlayIndex++;

    if (this.overlayIndex > this.imageService.getTemplateAmount()) {
      this.overlayIndex = 0;
    }

    this.updateOverlay();
  }
}
