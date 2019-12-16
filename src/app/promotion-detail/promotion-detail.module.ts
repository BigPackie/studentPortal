import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PromotionDetailPage } from './promotion-detail.page';
import { QuillModule } from 'ngx-quill';

const routes: Routes = [
  {
    path: '',
    component: PromotionDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuillModule.forRoot({
      format:"html",
      theme:"snow"
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [PromotionDetailPage]
})
export class PromotionDetailPageModule {}
