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
    title: string,
    subtitle: string,
    content: string,
    image: string,
    author: string
  ) {
    const article: Article = {
      title,
      subtitle,
      content,
      image,
      author,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.http
      .post<{ message: string }>('http://localhost:3000/api/articles', article)
      .subscribe((responseData) => {
        console.log(responseData.message);
      });

    this.articles.push(article);

    this.articlesUpdated.next([...this.articles]);
  }
}
