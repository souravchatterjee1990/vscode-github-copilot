import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  template: `
    <mat-card>
      <mat-card-title>{{ editing() ? 'Edit task' : 'Add task' }}</mat-card-title>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()" class="task-form">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput rows="3" formControlName="description"></textarea>
          </mat-form-field>

          <mat-checkbox formControlName="completed">Completed</mat-checkbox>

          <div class="actions">
            <button mat-stroked-button type="button" [routerLink]="['/']">Cancel</button>
            <button mat-flat-button type="submit" class="submit-btn" [disabled]="form.invalid">
              {{ editing() ? 'Save changes' : 'Add task' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .task-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }

      .submit-btn {
        --mdc-filled-button-container-color: #1976d2;
        --mdc-filled-button-label-text-color: #ffffff;
        --mat-filled-button-state-layer-color: #ffffff;
        --mat-filled-button-hover-state-layer-opacity: 0.08;
        background-color: #1976d2 !important;
        color: #ffffff !important;
      }

      .submit-btn:hover {
        background-color: #1565c0 !important;
      }

      .submit-btn[disabled] {
        opacity: 0.6;
      }
    `,
  ],
})
export class TaskFormComponent {
  readonly editing = input(false);
  readonly task = input<Task | null>(null);
  readonly saved = output<Task>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    completed: [false],
  });

  ngOnChanges() {
    const currentTask = this.task();
    if (currentTask) {
      this.form.patchValue({
        title: currentTask.title,
        description: currentTask.description,
        completed: currentTask.completed,
      });
    }
  }

  submit() {
    if (this.form.valid) {
      const { title, description, completed } = this.form.getRawValue();
      this.saved.emit({
        title: title ?? '',
        description: description ?? '',
        completed: Boolean(completed),
        status: completed ? 'COMPLETED' : 'PENDING',
      });
    }
  }
}
