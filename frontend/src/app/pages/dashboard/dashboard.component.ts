import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { Task, TaskStats } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, StatsCardComponent, TaskCardComponent],
  template: `
    <div class="container-fluid px-4 py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 class="fw-bold text-dark mb-1">
            Good {{ greeting() }}, {{ userName() }} 👋
          </h4>
          <p class="text-muted mb-0 small">{{ today | date:'EEEE, MMMM d, y' }}</p>
        </div>
        <a routerLink="/tasks/new" class="btn btn-primary fw-semibold">
          <i class="bi bi-plus-lg me-2"></i>New Task
        </a>
      </div>

      <!-- Stats Cards -->
      @if (loading()) {
        <div class="row g-3 mb-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="col-6 col-xl-3">
              <div class="card border-0 shadow-sm" style="height:100px">
                <div class="card-body d-flex align-items-center justify-content-center">
                  <div class="spinner-border spinner-border-sm text-primary"></div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="row g-3 mb-4">
          <div class="col-6 col-xl-3">
            <app-stats-card label="Total Tasks" [value]="stats().total" icon="list-task" color="primary" />
          </div>
          <div class="col-6 col-xl-3">
            <app-stats-card label="Completed" [value]="stats().completed" icon="check-circle-fill" color="success" />
          </div>
          <div class="col-6 col-xl-3">
            <app-stats-card label="In Progress" [value]="stats().inProgress" icon="arrow-repeat" color="warning" />
          </div>
          <div class="col-6 col-xl-3">
            <app-stats-card label="To Do" [value]="stats().pending" icon="hourglass-split" color="info" />
          </div>
        </div>
      }

      <!-- Recent Tasks -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">Recent Tasks</h5>
        <a routerLink="/tasks" class="btn btn-sm btn-outline-primary">View All</a>
      </div>

      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      } @else if (recentTasks().length === 0) {
        <div class="text-center py-5">
          <i class="bi bi-inbox display-4 text-muted"></i>
          <p class="text-muted mt-2">No tasks yet. Create your first task!</p>
          <a routerLink="/tasks/new" class="btn btn-primary">
            <i class="bi bi-plus-lg me-2"></i>Create Task
          </a>
        </div>
      } @else {
        <div class="row g-3">
          @for (task of recentTasks(); track task.id) {
            <div class="col-12 col-md-6 col-xl-4">
              <app-task-card [task]="task" (delete)="deleteTask($event)" />
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  stats = signal<TaskStats>({ total: 0, completed: 0, inProgress: 0, pending: 0 });
  tasks = signal<Task[]>([]);
  recentTasks = computed(() => this.tasks().slice(0, 6));
  today = new Date();

  readonly userName = computed(() => this.authService.currentUser()?.name ?? '');
  readonly greeting = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  });

  constructor(private taskService: TaskService, private authService: AuthService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.stats.set(res.stats);
        this.tasks.set(res.tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  deleteTask(id: string) {
    if (!confirm('Delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
    });
  }
}
