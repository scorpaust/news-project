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
    title: '',
    subtitle: '',
    content: '',
    image: '',
    author: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
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
      title: form.value.title,
      subtitle: form.value.subtitle,
      content: form.value.content,
      image: form.value.image,
      author: form.value.author,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const article: Article = this.newArticle;

    this.articlesService.addArticle(
      article.title,
      article.subtitle,
      article.content,
      article.image,
      article.author
    );

    form.resetForm();
  }
}
