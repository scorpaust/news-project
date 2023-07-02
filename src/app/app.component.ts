import { Component } from '@angular/core';
import { Article } from './articles/article.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  storedArticles: Article[] = [];
}
