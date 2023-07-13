import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleCreateComponent } from './articles/article-create/article-create.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  { path: '', component: ArticleListComponent },
  {
    path: 'create',
    component: ArticleCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:articleId',
    component: ArticleCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
