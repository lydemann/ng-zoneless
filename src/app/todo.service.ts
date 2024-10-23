import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, finalize } from 'rxjs';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = '/api/todos';
  
  todos = signal<Todo[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<Error | null>(null);

  constructor(private http: HttpClient) { }

  fetchTodos(){
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      tap(todos => this.todos.set(todos)),
      catchError((error) => {
        this.error.set(error);
        throw error;
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe();
  }

  addTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
    const originalTodos = this.todos();
    const newTodo: Todo = { ...todo, id: crypto.randomUUID() };
    this.todos.update(todos => [...todos, newTodo]);
    this.error.set(null);
    return this.http.post<Todo>(this.apiUrl, newTodo).pipe(
      catchError((error) => {
        this.todos.set(originalTodos);
        this.error.set(error);
        throw error;
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  updateTodo(todo: Todo): Observable<Todo> {
    const originalTodos = this.todos();
    this.todos.update(todos => todos.map(t => t.id === todo.id ? todo : t));
    this.error.set(null);
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo).pipe(
      catchError((error) => {
        this.todos.set(originalTodos);
        this.error.set(error);
        throw error;
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  deleteTodo(id: string): Observable<void> {
    const originalTodos = this.todos();
    this.todos.update(todos => todos.filter(t => t.id !== id));
    this.error.set(null);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.todos.set(originalTodos);
        this.error.set(error);
        throw error;
      }),
      finalize(() => this.isLoading.set(false))
    );
  }
}
