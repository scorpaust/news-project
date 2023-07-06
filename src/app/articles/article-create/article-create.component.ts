import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';

@Component({
  templateUrl: './article-create.component.html',
  selector: 'app-article-create',
  styleUrls: ['./article-create.component.css'],
})
export class ArticleCreateComponent implements OnInit {
  constructor(
    public articlesService: ArticlesService,
    public route: ActivatedRoute
  ) {}

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

  private mode = 'create';
  private articleId: string;
  article: Article;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('articleId')) {
        this.mode = 'edit';
        this.articleId = paramMap.get('articleId');
        this.isLoading = true;
        this.articlesService
          .getArticle(this.articleId)
          .subscribe((articleData) => {
            this.isLoading = false;
            this.article = {
              id: articleData._id,
              title: articleData.title,
              subtitle: articleData.subtitle,
              content: articleData.content,
              image: articleData.image,
              createdAt: articleData.createdAt,
              updatedAt: articleData.updatedAt,
            };
          });
      } else {
        this.mode = 'create';
        this.articleId = null;
      }
    });
  }

  onSaveArticle(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode == 'create') {
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
    } else {
      this.articlesService.updateArticle(
        this.articleId,
        form.value.title,
        form.value.subtitle,
        form.value.content,
        form.value.image,
        this.article.createdAt,
        this.article.updatedAt
      );

      form.resetForm();
    }
  }
}
