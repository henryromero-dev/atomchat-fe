import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, LoginResponse } from '../../domain/entities';
import { AuthRepository } from '../../domain/repositories';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl implements AuthRepository {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, request.toPlainObject()).pipe(
      map(response => {
        // Verificar si el usuario no existe y requiere registro
        if (response.requireRegister) {
          throw new Error('User not found. Please register first.');
        }
        
        // Verificar que tenemos los datos necesarios para el login exitoso
        if (!response.accessToken || !response.user) {
          throw new Error('Invalid response from server.');
        }
        
        return LoginResponse.fromPlainObject(response);
      }),
      catchError(error => throwError(() => error))
    );
  }

  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/register`, request.toPlainObject()).pipe(
      map(response => LoginResponse.fromPlainObject(response)),
      catchError(error => throwError(() => error))
    );
  }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    return this.http.get<User>(`${this.API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(user => User.fromPlainObject(user)),
      catchError(error => throwError(() => error))
    );
  }

  logout(): Observable<void> {
    // En este caso, el logout es solo local, no requiere llamada al servidor
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }
}
