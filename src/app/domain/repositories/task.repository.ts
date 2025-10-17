import { Observable } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../entities';

export interface TaskRepository {
  findAll(userId: string): Observable<Task[]>;
  findById(id: string): Observable<Task | null>;
  create(request: CreateTaskRequest): Observable<Task>;
  update(request: UpdateTaskRequest): Observable<Task>;
  delete(id: string): Observable<void>;
  toggleCompletion(id: string): Observable<Task>;
}
