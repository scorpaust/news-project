import { Component, OnInit } from '@angular/core';
import { Article } from './articles/article.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  storedArticles: Article[] = [];

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
