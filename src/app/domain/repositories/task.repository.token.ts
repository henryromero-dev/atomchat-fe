import { InjectionToken } from '@angular/core';
import { TaskRepository } from './task.repository';

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TaskRepository');
