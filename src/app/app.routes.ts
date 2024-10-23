import { Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { inject } from '@angular/core';
import { TodoService } from './todo.service';

export const routes: Routes = [
  { path: '', component: TodoListComponent, resolve: { todos: () => {
    const todoService = inject(TodoService);
    return todoService.fetchTodos();
  } } },
  // Add more routes as needed
];
