import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Article } from './article.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment.prod';

const BACKEND_URL = environment.apiUrl + '/articles';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private articles: any[] = [];

  private articlesUpdated = new Subject<{
    articles: Article[];
    articleCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getArticles(articlesPerPage: Number, currentPage: Number) {
    const queryParams = `?pagesize=${articlesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; articles: any; maxArticles: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((articleData) => {
          return {
            articles: articleData.articles.map((article) => {
              return {
                id: article._id,
                title: article.title,
                subtitle: article.subtitle,
                content: article.content,
                imagePath: article.imagePath,
                creator: article.creator,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
              };
            }),
            maxArticles: articleData.maxArticles,
          };
        })
      )
      .subscribe((transformedArticleData) => {
        this.articles = transformedArticleData.articles;
        this.articlesUpdated.next({
          articles: [...this.articles],
          articleCount: transformedArticleData.maxArticles,
        });
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
      .post<{ message: string; article: Article }>(BACKEND_URL, articleData)
      .subscribe((responseData) => {
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
      creator: string;
      createdAt: Date;
      updatedAt: Date;
    }>(BACKEND_URL + '/' + id);
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
        creator: null,
        createdAt,
        updatedAt: new Date(),
      };
    }

    this.http.put(BACKEND_URL + '/' + id, articleData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  deleteArticle(articleId: string) {
    return this.http.delete(BACKEND_URL + '/' + articleId);
  }
}
