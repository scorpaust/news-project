import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  isLoading: boolean = false;

  private authStatusSub: Subscription;

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => (this.isLoading = false));
  }

  onSignup(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;

    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
