import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  standalone: true,
  imports: [RouterModule, TodoListComponent],
  selector: 'app-root',
  template: `
    <div class="container mx-auto max-w-3xl p-4">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ title }}</h1>
      <app-todo-list></app-todo-list>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'Zoneless todo app';
}
