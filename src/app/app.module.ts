import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { MainComponent } from './main/main.component';
import {ImageCropperModule} from "ngx-image-cropper";
import { CropperComponent } from './cropper/cropper.component';
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import { PolicyComponent } from './policy/policy.component';
import { ImprintComponent } from './imprint/imprint.component';

@NgModule({
  declarations: [
    AppComponent,
    AvatarSelectorComponent,
    MainComponent,
    CropperComponent,
    PolicyComponent,
    ImprintComponent
  ],
  imports: [
    BrowserModule,
    ImageCropperModule,
    NgxSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
