import { http, HttpResponse, delay } from 'msw';
import { Todo } from '../app/todo.model';

let todos: Todo[] = [
  { id: '1', title: 'Learn Angular', completed: false },
  { id: '2', title: 'Create a todo app', completed: true },
];

export const handlers = [
  http.get<never, never, Todo[]>('/api/todos', async () => {
    await delay(500);
    return HttpResponse.json(todos);
  }),

  http.post<never, Todo, Todo>('/api/todos', async ({ request }) => {
    await delay(500);
    const newTodo = await request.json();
    todos.push(newTodo);
    return HttpResponse.json(newTodo);
  }),

  http.put<{ id: string }, Todo, Todo>('/api/todos/:id', async ({ request, params }) => {
    await delay(500);
    const updatedTodo = await request.json();
    const id = params['id'];
    todos = todos.map(todo => todo.id === id ? updatedTodo : todo);
    return HttpResponse.json(updatedTodo);
  }),

  http.delete<{ id: string }, null>('/api/todos/:id', async ({ params }) => {
    await delay(500);
    const id = params['id'];
    todos = todos.filter(todo => todo.id !== id);
    return HttpResponse.json(null);
  }),
];
