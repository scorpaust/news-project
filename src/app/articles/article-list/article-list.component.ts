import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
})
export class ArticleListComponent implements OnInit, OnDestroy {
  @Input() articles: Article[] = [];

  private articlesSub: Subscription;

  constructor(public articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.articlesService.getArticles();

    this.articlesSub = this.articlesService
      .getArticleUpdateListener()
      .subscribe((articles: Article[]) => {
        this.articles = articles;
      });
  }

  ngOnDestroy(): void {
    this.articlesSub.unsubscribe();
  }

  OnDelete(articleId: string) {
    this.articlesService.deleteArticle(articleId);
  }
}
