import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
    id: string;
    severity: 'success' | 'info' | 'warn' | 'error';
    summary: string;
    detail: string;
    life?: number;
}

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private readonly messagesSubject: BehaviorSubject<ToastMessage[]> = new BehaviorSubject<ToastMessage[]>([]);
    public readonly messages$ = this.messagesSubject.asObservable();

    public showSuccess(summary: string, detail: string = '', life: number = 3000): void {
        this.addMessage({
            id: this.generateId(),
            severity: 'success',
            summary,
            detail,
            life,
        });
    }

    public showError(summary: string, detail: string = '', life: number = 5000): void {
        this.addMessage({
            id: this.generateId(),
            severity: 'error',
            summary,
            detail,
            life,
        });
    }

    public showInfo(summary: string, detail: string = '', life: number = 3000): void {
        this.addMessage({
            id: this.generateId(),
            severity: 'info',
            summary,
            detail,
            life,
        });
    }

    public showWarning(summary: string, detail: string = '', life: number = 4000): void {
        this.addMessage({
            id: this.generateId(),
            severity: 'warn',
            summary,
            detail,
            life,
        });
    }

    public removeMessage(messageId: string): void {
        const currentMessages: ToastMessage[] = this.messagesSubject.value;
        const updatedMessages: ToastMessage[] = currentMessages.filter((msg: ToastMessage) => msg.id !== messageId);
        this.messagesSubject.next(updatedMessages);
    }

    public clearAll(): void {
        this.messagesSubject.next([]);
    }

    private addMessage(message: ToastMessage): void {
        const currentMessages: ToastMessage[] = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, message]);

        if (message.life && message.life > 0) {
            setTimeout(() => {
                this.removeMessage(message.id);
            }, message.life);
        }
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
