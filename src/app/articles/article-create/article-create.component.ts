import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';

@Component({
  templateUrl: './article-create.component.html',
  selector: 'app-article-create',
  styleUrls: ['./article-create.component.css'],
})
export class ArticleCreateComponent {
  constructor(public articlesService: ArticlesService) {}

  newArticle = {
    id: '',
    title: '',
    subtitle: '',
    content: '',
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  id = '';
  content = '';
  title = '';
  subtitle = '';
  image = '';
  author = '';
  createdAt = new Date();
  updatedAt = new Date();

  onAddArticle(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.newArticle = {
      id: '',
      title: form.value.title,
      subtitle: form.value.subtitle,
      content: form.value.content,
      image: form.value.image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const article: Article = this.newArticle;

    this.articlesService.addArticle(
      article.id,
      article.title,
      article.subtitle,
      article.content,
      article.image
    );

    form.resetForm();
  }
}
