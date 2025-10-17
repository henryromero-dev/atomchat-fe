import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private readonly loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

    public setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    public getLoading(): boolean {
        return this.loadingSubject.value;
    }
}
