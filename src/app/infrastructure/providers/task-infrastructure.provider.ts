import { Provider } from '@angular/core';
import { TASK_REPOSITORY } from '../../domain/repositories';
import { TaskRepositoryImpl } from '../repositories';

export const TASK_INFRASTRUCTURE_PROVIDERS: Provider[] = [
  {
    provide: TASK_REPOSITORY,
    useClass: TaskRepositoryImpl
  }
];
