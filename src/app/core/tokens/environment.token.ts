import { InjectionToken } from '@angular/core';

export interface Environment {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    userKey: string;
  };
  ui: {
    defaultPageSize: number;
    maxPageSize: number;
    toastDuration: number;
  };
}

export const ENVIRONMENT = new InjectionToken<Environment>('Environment');
