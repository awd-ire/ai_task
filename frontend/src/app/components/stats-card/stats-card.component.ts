import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  template: `
    <div class="card border-0 shadow-sm h-100">
      <div class="card-body d-flex align-items-center gap-3 p-4">
        <div class="stats-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
             [class]="'bg-' + color + '-subtle'">
          <i [class]="'bi bi-' + icon + ' fs-3 text-' + color"></i>
        </div>
        <div>
          <div class="fs-2 fw-bold text-dark lh-1 mb-1">{{ value }}</div>
          <div class="text-muted small fw-medium">{{ label }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-icon { width: 60px; height: 60px; }
  `],
})
export class StatsCardComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() icon = 'check-circle';
  @Input() color = 'primary';
}
