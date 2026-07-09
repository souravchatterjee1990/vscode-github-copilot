import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskPageComponent } from './pages/task-page/task-page.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'task', component: TaskPageComponent },
];
