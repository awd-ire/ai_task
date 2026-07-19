import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="container py-4" style="max-width: 700px">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/tasks" class="text-decoration-none">Tasks</a></li>
          <li class="breadcrumb-item active">{{ isEditMode ? 'Edit Task' : 'New Task' }}</li>
        </ol>
      </nav>

      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-bottom py-3 px-4">
          <h5 class="fw-bold mb-0">
            <i [class]="'bi bi-' + (isEditMode ? 'pencil-square' : 'plus-circle') + ' text-primary me-2'"></i>
            {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
          </h5>
        </div>

        <div class="card-body p-4">
          <!-- Error -->
          @if (error()) {
            <div class="alert alert-danger d-flex align-items-center gap-2">
              <i class="bi bi-exclamation-triangle-fill"></i>
              {{ error() }}
            </div>
          }

          <!-- Success -->
          @if (successMsg()) {
            <div class="alert alert-success d-flex align-items-center gap-2">
              <i class="bi bi-check-circle-fill"></i>
              {{ successMsg() }}
            </div>
          }

          @if (fetchingTask()) {
            <div class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <!-- Title -->
              <div class="mb-3">
                <label class="form-label fw-medium">Task Title <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input type="text" class="form-control" [class.is-invalid]="isInvalid('title')"
                         formControlName="title" placeholder="e.g. Build Login Page">
                  <button type="button" class="btn btn-outline-primary" [disabled]="aiLoading()"
                          (click)="generateDescription()" title="Generate description with AI">
                    @if (aiLoading()) {
                      <span class="spinner-border spinner-border-sm"></span>
                    } @else {
                      <i class="bi bi-stars"></i>
                    }
                  </button>
                </div>
                @if (isInvalid('title')) {
                  <div class="invalid-feedback d-block">Title must be at least 2 characters.</div>
                }
              </div>

              <!-- AI Hint -->
              <div class="alert alert-primary alert-sm d-flex align-items-center gap-2 py-2 mb-3" role="alert">
                <i class="bi bi-lightbulb-fill text-warning"></i>
                <small>Enter a title and click <strong><i class="bi bi-stars"></i> ✨</strong> to auto-generate a description using AI.</small>
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label fw-medium d-flex align-items-center gap-2">
                  Description
                  @if (aiGeneratedDomain()) {
                    <span class="badge bg-primary-subtle text-primary small fw-normal">
                      <i class="bi bi-stars me-1"></i>AI: {{ aiGeneratedDomain() }}
                    </span>
                  }
                </label>
                <textarea class="form-control" rows="4" formControlName="description"
                          placeholder="Describe what needs to be done..."
                          [class.is-invalid]="isInvalid('description')"></textarea>
                @if (isInvalid('description')) {
                  <div class="invalid-feedback d-block">Description is too long (max 1000 chars).</div>
                }
              </div>

              <!-- Status & Priority -->
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Status</label>
                  <select class="form-select" formControlName="status">
                    <option value="Todo">📋 Todo</option>
                    <option value="In Progress">🔄 In Progress</option>
                    <option value="Completed">✅ Completed</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Priority</label>
                  <select class="form-select" formControlName="priority">
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </select>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex gap-3 justify-content-end">
                <a routerLink="/tasks" class="btn btn-outline-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary fw-semibold px-4" [disabled]="loading()">
                  @if (loading()) {
                    <span class="spinner-border spinner-border-sm me-2"></span>Saving...
                  } @else {
                    <i class="bi bi-check2 me-2"></i>{{ isEditMode ? 'Update Task' : 'Create Task' }}
                  }
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class TaskFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  taskId: string | null = null;

  loading = signal(false);
  fetchingTask = signal(false);
  aiLoading = signal(false);
  error = signal<string | null>(null);
  successMsg = signal<string | null>(null);
  aiGeneratedDomain = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      status: ['Todo', Validators.required],
      priority: ['Medium', Validators.required],
    });
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  loadTask(id: string) {
    this.fetchingTask.set(true);
    this.taskService.getTask(id).subscribe({
      next: ({ task }) => {
        this.form.patchValue(task);
        this.fetchingTask.set(false);
      },
      error: () => {
        this.error.set('Task not found.');
        this.fetchingTask.set(false);
      },
    });
  }

  generateDescription() {
    const title = this.form.get('title')?.value?.trim();
    if (!title || title.length < 2) {
      this.error.set('Please enter a task title first.');
      setTimeout(() => this.error.set(null), 3000);
      return;
    }

    this.aiLoading.set(true);
    this.error.set(null);

    this.taskService.generateDescription(title).subscribe({
      next: (res) => {
        this.form.patchValue({ description: res.description });
        this.aiGeneratedDomain.set(res.domain);
        this.aiLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to generate description. Please try again.');
        this.aiLoading.set(false);
      },
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

    const request = this.isEditMode && this.taskId
      ? this.taskService.updateTask(this.taskId, this.form.value)
      : this.taskService.createTask(this.form.value);

    request.subscribe({
      next: () => {
        this.successMsg.set(this.isEditMode ? 'Task updated successfully!' : 'Task created successfully!');
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/tasks']), 1200);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Something went wrong. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
