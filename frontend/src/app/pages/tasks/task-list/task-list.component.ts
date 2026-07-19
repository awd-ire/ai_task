import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TaskService } from '../../../services/task.service';
import { Task, TaskFilters } from '../../../models/task.model';
import { TaskCardComponent } from '../../../components/task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, FormsModule, TaskCardComponent],
  template: `
    <div class="container-fluid px-4 py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 class="fw-bold text-dark mb-1">All Tasks</h4>
          <p class="text-muted small mb-0">{{ tasks().length }} task(s) found</p>
        </div>
        <a routerLink="/tasks/new" class="btn btn-primary fw-semibold">
          <i class="bi bi-plus-lg me-2"></i>New Task
        </a>
      </div>

      <!-- Search & Filters -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-3">
          <div class="row g-3 align-items-center">
            <div class="col-12 col-md-5">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input type="text" class="form-control border-start-0 ps-0"
                       placeholder="Search tasks..." [(ngModel)]="searchTerm"
                       (ngModelChange)="onSearch($event)">
                @if (searchTerm) {
                  <button class="btn btn-outline-secondary border-start-0" (click)="clearSearch()">
                    <i class="bi bi-x-lg"></i>
                  </button>
                }
              </div>
            </div>
            <div class="col-6 col-md-3">
              <select class="form-select" [(ngModel)]="filters.status" (change)="loadTasks()">
                <option value="All">All Statuses</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div class="col-6 col-md-3">
              <select class="form-select" [(ngModel)]="filters.priority" (change)="loadTasks()">
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div class="col-12 col-md-1">
              <button class="btn btn-outline-secondary w-100" (click)="resetFilters()" title="Reset filters">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Tabs -->
      <div class="d-flex gap-2 mb-4 flex-wrap">
        @for (tab of statusTabs; track tab.value) {
          <button class="btn btn-sm rounded-pill"
                  [class]="filters.status === tab.value ? 'btn-primary' : 'btn-outline-secondary'"
                  (click)="setStatus(tab.value)">
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="text-muted mt-2">Loading tasks...</p>
        </div>
      }

      <!-- Task Grid -->
      @if (!loading()) {
        @if (tasks().length === 0) {
          <div class="text-center py-5">
            <i class="bi bi-clipboard-x display-4 text-muted"></i>
            <h5 class="mt-3 text-muted">No tasks found</h5>
            <p class="text-muted small">Try adjusting your filters or create a new task.</p>
            <a routerLink="/tasks/new" class="btn btn-primary mt-2">
              <i class="bi bi-plus-lg me-2"></i>Create Task
            </a>
          </div>
        } @else {
          <div class="row g-3">
            @for (task of tasks(); track task.id) {
              <div class="col-12 col-md-6 col-xl-4">
                <app-task-card [task]="task" (delete)="deleteTask($event)" />
              </div>
            }
          </div>
        }
      }
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  loading = signal(false);
  searchTerm = '';
  filters: TaskFilters = { search: '', status: 'All', priority: 'All' };

  private searchSubject = new Subject<string>();

  statusTabs = [
    { label: 'All', value: 'All' },
    { label: '📋 Todo', value: 'Todo' },
    { label: '🔄 In Progress', value: 'In Progress' },
    { label: '✅ Completed', value: 'Completed' },
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    // Debounce search input
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => this.loadTasks());
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    const activeFilters = { ...this.filters, search: this.searchTerm };
    this.taskService.getTasks(activeFilters).subscribe({
      next: (res) => {
        this.tasks.set(res.tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadTasks();
  }

  setStatus(status: string) {
    this.filters.status = status;
    this.loadTasks();
  }

  resetFilters() {
    this.searchTerm = '';
    this.filters = { search: '', status: 'All', priority: 'All' };
    this.loadTasks();
  }

  deleteTask(id: string) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
    });
  }
}
