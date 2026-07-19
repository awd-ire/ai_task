import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div class="auth-card card border-0 shadow-lg p-4 p-md-5">
        <div class="text-center mb-4">
          <div class="mb-3">
            <i class="bi bi-check2-square text-primary display-4"></i>
          </div>
          <h2 class="fw-bold text-dark">Create account</h2>
          <p class="text-muted">Join AI Task Manager today</p>
        </div>

        @if (error()) {
          <div class="alert alert-danger alert-dismissible d-flex align-items-center gap-2">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>{{ error() }}</span>
            <button type="button" class="btn-close" (click)="error.set(null)"></button>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label fw-medium">Full Name</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-person text-muted"></i>
              </span>
              <input type="text" class="form-control border-start-0 ps-0"
                     [class.is-invalid]="isInvalid('name')"
                     formControlName="name" placeholder="John Doe">
            </div>
            @if (isInvalid('name')) {
              <div class="invalid-feedback d-block">Name must be at least 2 characters.</div>
            }
          </div>

          <div class="mb-3">
            <label class="form-label fw-medium">Email address</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-envelope text-muted"></i>
              </span>
              <input type="email" class="form-control border-start-0 ps-0"
                     [class.is-invalid]="isInvalid('email')"
                     formControlName="email" placeholder="you@example.com">
            </div>
            @if (isInvalid('email')) {
              <div class="invalid-feedback d-block">Please enter a valid email address.</div>
            }
          </div>

          <div class="mb-4">
            <label class="form-label fw-medium">Password</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-lock text-muted"></i>
              </span>
              <input [type]="showPass() ? 'text' : 'password'"
                     class="form-control border-start-0 border-end-0 ps-0"
                     [class.is-invalid]="isInvalid('password')"
                     formControlName="password" placeholder="Min. 6 characters">
              <button type="button" class="input-group-text bg-light"
                      style="cursor:pointer" (click)="showPass.set(!showPass())">
                <i [class]="'bi bi-eye' + (showPass() ? '-slash' : '') + ' text-muted'"></i>
              </button>
            </div>
            @if (isInvalid('password')) {
              <div class="invalid-feedback d-block">Password must be at least 6 characters.</div>
            }
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner-border spinner-border-sm me-2"></span>Creating account...
            } @else {
              <i class="bi bi-person-plus me-2"></i>Create Account
            }
          </button>
        </form>

        <p class="text-center mt-4 text-muted mb-0">
          Already have an account?
          <a routerLink="/auth/login" class="text-primary fw-medium text-decoration-none">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-card { width: 100%; max-width: 420px; border-radius: 16px; }
    .auth-page { background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%); }
  `],
})
export class RegisterComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  showPass = signal(false);

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.register(this.form.value).subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Registration failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
