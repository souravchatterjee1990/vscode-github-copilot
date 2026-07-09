import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [TaskFormComponent],
  template: `
    <app-task-form
      [editing]="editing()"
      [task]="selectedTask()"
      (saved)="saveTask($event)"
    ></app-task-form>
  `,
})
export class TaskPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  readonly editing = signal(false);
  readonly selectedTask = signal<Task | null>(null);

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editing.set(true);
        this.taskService.getTask(Number(id)).subscribe((task) => this.selectedTask.set(task));
      }
    });
  }

  saveTask(task: Task) {
    if (this.editing()) {
      this.taskService
        .updateTask(this.selectedTask()!.id!, task)
        .subscribe(() => this.router.navigateByUrl('/'));
      return;
    }
    this.taskService.createTask(task).subscribe(() => this.router.navigateByUrl('/'));
  }
}
