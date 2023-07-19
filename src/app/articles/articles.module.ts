import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleListComponent } from './article-list/article-list.component';

@NgModule({
  declarations: [ArticleCreateComponent, ArticleListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
  ],
})
export class ArticlesModule {}
