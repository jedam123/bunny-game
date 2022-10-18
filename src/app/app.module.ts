import { BrowserModule } from '@angular/platform-browser';
import { ElementRef, NgModule, OnInit, Renderer2 } from '@angular/core';

import { AppComponent } from './app.component';
import { BunnyComponent } from './components/bunny/bunny.component';

@NgModule({
  declarations: [AppComponent, BunnyComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
