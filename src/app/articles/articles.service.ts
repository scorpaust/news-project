import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Article } from './article.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private articles: any[] = [];

  private articlesUpdated = new Subject<Article[]>();

  constructor(private http: HttpClient) {}

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
              image: article.image,
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

  addArticle(
    id: string,
    title: string,
    subtitle: string,
    content: string,
    image: string
  ) {
    const article: Article = {
      id,
      title,
      subtitle,
      content,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.http
      .post<{ message: string; articleId: string }>(
        'http://localhost:3000/api/articles',
        article
      )
      .subscribe((responseData) => {
        const id = responseData.articleId;
        article.id = id as string;
        console.log(responseData.message);
      });

    this.articles.push(article);

    this.articlesUpdated.next([...this.articles]);
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
