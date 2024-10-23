import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoService } from '../todo.service';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="bg-white shadow-md rounded-lg p-6">
      <mat-form-field class="w-full">
        <input
          matInput
          placeholder="Add new todo"
          [(ngModel)]="newTodoTitle"
          (keyup.enter)="addTodo()"
          class="w-full"
        />
        <button
          mat-icon-button
          matSuffix
          (click)="addTodo()"
          class="text-blue-500"
        >
          <mat-icon>add</mat-icon>
        </button>
      </mat-form-field>

      @if (loading()) {
      <div class="flex justify-center my-4">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      } @else {
      <div>
        <div
          *ngFor="let todo of todos()"
          class="border-b last:border-b-0 py-2 flex items-center"
        >
          @if (editingTodoId() === todo.id) {
            <mat-form-field class="flex-grow mr-2">
              <input
                matInput
                [(ngModel)]="editTodoTitle"
                (keyup.enter)="updateTodo(todo)"
                (blur)="onInputBlur($event)"
              />
            </mat-form-field>
            <div class="flex gap-2">
            <button mat-icon-button color="primary" (click)="updateTodo(todo)" (mousedown)="$event.preventDefault()">
              <mat-icon>check</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="cancelEdit()" (mousedown)="$event.preventDefault()">
              <mat-icon>close</mat-icon>
              </button>
            </div>
          } @else {
            <mat-checkbox
              [checked]="todo.completed"
              (change)="toggleTodo(todo)"
              class="mr-4"
            >
              <span
                [class.line-through]="todo.completed"
                [class.text-gray-500]="todo.completed"
                >{{ todo.title }}</span
              >
            </mat-checkbox>
            <button
              mat-icon-button
              color="primary"
              (click)="startEdit(todo)"
              class="ml-auto mr-2"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="deleteTodo(todo.id)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          }
        </div>
      </div>
      }
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  newTodoTitle = '';
  editingTodoId = signal<string | null>(null);
  editTodoTitle = '';
  private todoService = inject(TodoService);
  todos = this.todoService.todos;
  loading = this.todoService.isLoading;

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService
        .addTodo({ title: this.newTodoTitle, completed: false } as Todo)
        .subscribe((newTodo) => {
          this.newTodoTitle = '';
        });
    }
  }

  toggleTodo(todo: Todo): void {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(updatedTodo).subscribe();
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe();
  }

  onInputBlur(event: FocusEvent): void {
    event.preventDefault();
    this.cancelEdit();
  }

  startEdit(todo: Todo): void {
    this.editingTodoId.set(todo.id);
    this.editTodoTitle = todo.title;
  }

  updateTodo(todo: Todo): void {
    if (this.editTodoTitle.trim() && this.editTodoTitle !== todo.title) {
      const updatedTodo = { ...todo, title: this.editTodoTitle };
      this.todoService.updateTodo(updatedTodo).subscribe(() => {
        this.editingTodoId.set(null);
        this.editTodoTitle = '';
      });
    } else {
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingTodoId.set(null);
    this.editTodoTitle = '';
  }
}
