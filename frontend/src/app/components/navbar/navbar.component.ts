import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid px-4">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" routerLink="/dashboard">
          <i class="bi bi-check2-square"></i>
          <span>AI Task Manager</span>
        </a>

        @if (isLoggedIn()) {
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                  <i class="bi bi-speedometer2 me-1"></i>Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/tasks" routerLinkActive="active">
                  <i class="bi bi-list-task me-1"></i>Tasks
                </a>
              </li>
            </ul>

            <div class="d-flex align-items-center gap-3">
              <span class="text-white-50 small">
                <i class="bi bi-person-circle me-1"></i>{{ userName() }}
              </span>
              <button class="btn btn-outline-light btn-sm" (click)="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </div>
          </div>
        }
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  private authService = inject(AuthService);
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly userName = computed(() => this.authService.currentUser()?.name ?? '');

  logout() {
    this.authService.logout();
  }
}
