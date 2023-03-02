import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { MultiSelectModule } from 'primeng/multiselect';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MultiSelectModule,
    FormsModule,
    HttpClientModule,
    TreeModule,
    TreeSelectModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
