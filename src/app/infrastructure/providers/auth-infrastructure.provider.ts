import { Provider } from '@angular/core';
import { AUTH_REPOSITORY } from '../../domain/repositories';
import { AuthRepositoryImpl } from '../repositories';

export const AUTH_INFRASTRUCTURE_PROVIDERS: Provider[] = [
  {
    provide: AUTH_REPOSITORY,
    useClass: AuthRepositoryImpl
  }
];
