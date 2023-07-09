import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
})
export class ArticleListComponent implements OnInit, OnDestroy {
  @Input() articles: Article[] = [];

  private articlesSub: Subscription;

  constructor(public articlesService: ArticlesService) {}

  isLoading: boolean = false;

  totalArticles = 0;

  articlesPerPage = 2;

  currentPage = 1;

  pageSizeOptions = [1, 2, 5, 10];

  ngOnInit(): void {
    this.isLoading = true;

    this.articlesService.getArticles(this.articlesPerPage, 1);

    this.articlesSub = this.articlesService
      .getArticleUpdateListener()
      .subscribe(
        (articleData: { articles: Article[]; articleCount: number }) => {
          this.isLoading = false;
          this.articles = articleData.articles;
          this.totalArticles = articleData.articleCount;
        }
      );
  }

  ngOnDestroy(): void {
    this.articlesSub.unsubscribe();
  }

  OnDelete(articleId: string) {
    this.isLoading = true;
    this.articlesService.deleteArticle(articleId).subscribe(() => {
      this.articlesService.getArticles(this.articlesPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.articlesPerPage = pageData.pageSize;
    this.articlesService.getArticles(this.articlesPerPage, this.currentPage);
  }
}
