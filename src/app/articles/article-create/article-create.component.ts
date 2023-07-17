import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  templateUrl: './article-create.component.html',
  selector: 'app-article-create',
  styleUrls: ['./article-create.component.css'],
})
export class ArticleCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  article: Article;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private articleId: string;
  private authStatusSub: Subscription;

  constructor(
    public articlesService: ArticlesService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)],
      }),
      subtitle: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(20)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
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
              imagePath: articleData.imagePath,
              creator: articleData.creator,
              createdAt: articleData.createdAt,
              updatedAt: articleData.updatedAt,
            };
            this.form.setValue({
              title: this.article.title,
              subtitle: this.article.subtitle,
              content: this.article.content,
              image: this.article.imagePath,
            });
          });
      } else {
        this.mode = 'create';
        this.articleId = null;
      }
    });
  }

  onSaveArticle() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode == 'create') {
      this.articlesService.addArticle(
        this.form.value.title,
        this.form.value.subtitle,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.articlesService.updateArticle(
        this.articleId,
        this.form.value.title,
        this.form.value.subtitle,
        this.form.value.content,
        this.form.value.image,
        this.article.createdAt,
        new Date()
      );

      this.form.reset();
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file,
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
