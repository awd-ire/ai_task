import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink, DatePipe],
  template: `
    <div class="card border-0 shadow-sm task-card h-100" [class.border-start]="true"
         [class]="'border-' + priorityColor(task.priority)">
      <div class="card-body p-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-start mb-3">
          <span [class]="'badge rounded-pill bg-' + statusColor(task.status) + '-subtle text-' + statusColor(task.status) + ' fw-medium'">
            {{ task.status }}
          </span>
          <div class="dropdown">
            <button class="btn btn-sm btn-ghost p-1 rounded" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical text-muted"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li>
                <a class="dropdown-item" [routerLink]="['/tasks/edit', task.id]">
                  <i class="bi bi-pencil me-2 text-primary"></i>Edit
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger" (click)="delete.emit(task.id?.toString() ?? '')">
                  <i class="bi bi-trash me-2"></i>Delete
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Title -->
        <h6 class="card-title fw-semibold mb-2 text-dark">{{ task.title }}</h6>

        <!-- Description -->
        @if (task.description) {
          <p class="card-text text-muted small mb-3 description-clamp">{{ task.description }}</p>
        }

        <!-- Footer -->
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <span [class]="'badge bg-' + priorityColor(task.priority) + '-subtle text-' + priorityColor(task.priority)">
            <i class="bi bi-flag-fill me-1"></i>{{ task.priority }}
          </span>
          <small class="text-muted">{{ task.createdAt | date:'MMM d, y' }}</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      border-left-width: 4px !important;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,.1) !important;
    }
    .description-clamp {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .btn-ghost:hover { background: rgba(0,0,0,.05); }
  `],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() delete = new EventEmitter<string>();

  statusColor(status: string): string {
    const map: Record<string, string> = {
      'Todo': 'secondary',
      'In Progress': 'warning',
      'Completed': 'success',
    };
    return map[status] ?? 'secondary';
  }

  priorityColor(priority: string): string {
    const map: Record<string, string> = {
      'Low': 'info',
      'Medium': 'warning',
      'High': 'danger',
    };
    return map[priority] ?? 'secondary';
  }
}
