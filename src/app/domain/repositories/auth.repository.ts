import { Observable } from 'rxjs';
import { User, LoginRequest, RegisterRequest, LoginResponse } from '../entities';

export interface AuthRepository {
  login(request: LoginRequest): Observable<LoginResponse>;
  register(request: RegisterRequest): Observable<LoginResponse>;
  getCurrentUser(): Observable<User>;
  logout(): Observable<void>;
}
