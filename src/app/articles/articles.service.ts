import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Article } from './article.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private articles: any[] = [];

  private articlesUpdated = new Subject<Article[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getArticles() {
    this.http
      .get<{ message: string; articles: any }>(
        'http://localhost:3000/api/articles'
      )
      .pipe(
        map((articleData) => {
          return articleData.articles.map((article) => {
            return {
              id: article._id,
              title: article.title,
              subtitle: article.subtitle,
              content: article.content,
              imagePath: article.imagePath,
              createdAt: article.createdAt,
              updatedAt: article.updatedAt,
            };
          });
        })
      )
      .subscribe((transformedArticles) => {
        this.articles = transformedArticles;
        this.articlesUpdated.next([...this.articles]);
      });
  }

  getArticleUpdateListener() {
    return this.articlesUpdated.asObservable();
  }

  addArticle(title: string, subtitle: string, content: string, image: File) {
    const articleData = new FormData();
    articleData.append('title', title);
    articleData.append('subtitle', subtitle);
    articleData.append('content', content);
    articleData.append('image', image, title);

    this.http
      .post<{ message: string; article: Article }>(
        'http://localhost:3000/api/articles',
        articleData
      )
      .subscribe((responseData) => {
        const article: any = {
          id: responseData.article.id,
          title: title,
          subtitle: subtitle,
          content: content,
          imagePath: responseData.article.imagePath,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.articles.push(article);
        this.articlesUpdated.next([...this.articles]);
        this.router.navigate(['/']);
      });
  }

  getArticle(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      subtitle: string;
      content: string;
      imagePath: string;
      createdAt: Date;
      updatedAt: Date;
    }>('http://localhost:3000/api/articles/' + id);
  }

  updateArticle(
    id: string,
    title: string,
    subtitle: string,
    content: string,
    image: File | string,
    createdAt: Date,
    updatedAt: Date
  ) {
    let articleData: Article | FormData;
    if (typeof image == 'object') {
      articleData = new FormData();
      articleData.append('id', id);
      articleData.append('title', title);
      articleData.append('subtitle', subtitle);
      articleData.append('content', content);
      articleData.append('image', image, title);
    } else {
      articleData = {
        id: id,
        title: title,
        subtitle,
        content,
        imagePath: image,
        createdAt,
        updatedAt: new Date(),
      };
    }

    this.http
      .put('http://localhost:3000/api/articles/' + id, articleData)
      .subscribe((response) => {
        const updatedArticles = [...this.articles];

        const oldArticleIndex = updatedArticles.findIndex((a) => a.id === id);

        const article: Article = {
          id: id,
          title: title,
          subtitle,
          content,
          imagePath: '',
          createdAt,
          updatedAt: new Date(),
        };

        updatedArticles[oldArticleIndex] = article;

        this.articles = updatedArticles;

        this.articlesUpdated.next([...this.articles]);

        this.router.navigate(['/']);
      });
  }

  deleteArticle(articleId: string) {
    this.http
      .delete('http://localhost:3000/api/articles/' + articleId)
      .subscribe(() => {
        const updatedArticles = this.articles.filter(
          (article) => article.id !== articleId
        );
        this.articles = updatedArticles;
        this.articlesUpdated.next([...this.articles]);
      });
  }
}
