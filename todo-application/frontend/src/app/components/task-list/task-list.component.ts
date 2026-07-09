import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatCheckboxModule, RouterLink],
  template: `
    <mat-card>
      <mat-card-title>Tasks</mat-card-title>
      <mat-card-content>
        <div class="toolbar">
          <a mat-flat-button class="add-task-button" routerLink="/task">Add task</a>
        </div>
        <table mat-table [dataSource]="tasks()" class="mat-elevation-z0 full-width">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let task">{{ task.title }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let task">
              <span
                class="status-chip"
                [class.status-chip--completed]="isCompleted(task.status, task.completed)"
              >
                {{ statusLabel(task.status, task.completed) }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="completed">
            <th mat-header-cell *matHeaderCellDef>Completed</th>
            <td mat-cell *matCellDef="let task">
              <mat-checkbox [checked]="task.completed" disabled></mat-checkbox>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let task">
              <a mat-stroked-button [routerLink]="['/task']" [queryParams]="{ id: task.id }"
                >Edit</a
              >
              <button mat-stroked-button color="warn" (click)="deleteTask(task.id)">Delete</button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
      }
      .add-task-button {
        background: #2e7d32;
        color: #ffffff;
      }
      .add-task-button:hover {
        background: #256428;
      }
      .full-width {
        width: 100%;
      }
      .status-chip {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 0.125rem 0.625rem;
        font-size: 0.8rem;
        font-weight: 600;
        color: #8a6d00;
        background: #fff4ce;
      }
      .status-chip--completed {
        color: #1b5e20;
        background: #c8e6c9;
      }
      button,
      a {
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class TaskListComponent {
  private readonly taskService = inject(TaskService);
  readonly tasks = signal<Task[]>([]);
  readonly displayedColumns = ['title', 'status', 'completed', 'actions'];

  constructor() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => this.tasks.set(tasks));
  }

  deleteTask(id?: number) {
    if (!id) {
      return;
    }

    const shouldDelete = window.confirm('Are you sure you want to delete this task?');
    if (!shouldDelete) {
      return;
    }

    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }

  statusLabel(status: Task['status'], completed: boolean): string {
    const resolvedStatus = status ?? (completed ? 'COMPLETED' : 'PENDING');
    return resolvedStatus === 'COMPLETED' ? 'Completed' : 'Pending';
  }

  isCompleted(status: Task['status'], completed: boolean): boolean {
    return (status ?? (completed ? 'COMPLETED' : 'PENDING')) === 'COMPLETED';
  }
}
