import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../domain/entities';
import { TaskRepository } from '../../domain/repositories';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskRepositoryImpl implements TaskRepository {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(_userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/tasks`).pipe(
      map(tasks => tasks.map(task => Task.fromPlainObject(task))),
      catchError(error => throwError(() => error))
    );
  }

  findById(id: string): Observable<Task | null> {
    return this.http.get<Task>(`${this.API_URL}/tasks/${id}`).pipe(
      map(task => Task.fromPlainObject(task)),
      catchError(error => throwError(() => error))
    );
  }

  create(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/tasks`, request.toPlainObject()).pipe(
      map(task => Task.fromPlainObject(task)),
      catchError(error => throwError(() => error))
    );
  }

  update(request: UpdateTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.API_URL}/tasks/${request.id}`, {
      title: request.title,
      description: request.description,
      completed: request.completed
    }).pipe(
      map(task => Task.fromPlainObject(task)),
      catchError(error => throwError(() => error))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/tasks/${id}`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  toggleCompletion(id: string): Observable<Task> {
    // This would need to be implemented in the backend or we can use the update method
    // For now, we'll use a workaround by getting the task first and then updating it
    return this.findById(id).pipe(
      map(task => {
        if (!task) {
          throw new Error('Task not found');
        }
        return task;
      }),
      switchMap(task => {
        const updatedRequest = new UpdateTaskRequest(
          task.id,
          task.title,
          task.description,
          !task.completed,
          task.userId
        );
        return this.update(updatedRequest);
      }),
      catchError(error => throwError(() => error))
    );
  }
}
