import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Interface representing a toast notification message
 */
export interface ToastMessage {
    /** Unique identifier for the message */
    id: string;
    /** Severity level of the message */
    severity: 'success' | 'info' | 'warn' | 'error';
    /** Main message text */
    summary: string;
    /** Additional detail text */
    detail: string;
    /** Auto-dismiss time in milliseconds (optional) */
    life?: number;
}

/**
 * ToastService - Centralized toast notification service
 * 
 * This service provides a centralized way to display toast notifications throughout
 * the application. It manages toast messages using RxJS BehaviorSubject for reactive
 * state management and supports different severity levels.
 * 
 * Features:
 * - Success, error, warning, and info notifications
 * - Configurable auto-dismiss timing
 * - Message queuing and management
 * - Reactive state updates
 * - Unique message identification
 * 
 * @example
 * ```typescript
 * // Inject the service
 * private readonly toastService = inject(ToastService);
 * 
 * // Show success message
 * this.toastService.showSuccess('Operation completed successfully!');
 * 
 * // Show error with details
 * this.toastService.showError('Operation failed', 'Please try again later');
 * 
 * // Show warning with custom duration
 * this.toastService.showWarning('Warning message', '', 6000);
 * ```
 */
@Injectable({
    providedIn: 'root',
})
export class ToastService {
    /** BehaviorSubject for managing toast messages state */
    private readonly messagesSubject: BehaviorSubject<ToastMessage[]> = new BehaviorSubject<ToastMessage[]>([]);
    
    /** Public observable for toast messages */
    public readonly messages$ = this.messagesSubject.asObservable();

    /**
     * Shows a success toast message
     * @param summary - Main message text
     * @param detail - Additional detail text (optional)
     * @param life - Auto-dismiss time in milliseconds (default: 3000)
     */
    public showSuccess(summary: string, detail: string = '', life: number = 3000): void {
        this.addMessage({
            id: this.generateId(),
            severity: 'success',
            summary,
            detail,
            life,
        });
    }

    /**
     * Shows an error toast message
     * @param summary - Main message text
     * @param detail - Additional detail text (optional)
     * @param life - Auto-dismiss time in milliseconds (default: 5000)
     */
    public showError(summary: string, detail: string = '', life: number = 5000): void {
        this.addMessage({
            id: this.generateId(),
            severity: 'error',
            summary,
            detail,
            life,
        });
    }

    /**
     * Shows an info toast message
     * @param summary - Main message text
     * @param detail - Additional detail text (optional)
     * @param life - Auto-dismiss time in milliseconds (default: 3000)
     */
    public showInfo(summary: string, detail: string = '', life: number = 3000): void {
        this.addMessage({
            id: this.generateId(),
            severity: 'info',
            summary,
            detail,
            life,
        });
    }

    /**
     * Shows a warning toast message
     * @param summary - Main message text
     * @param detail - Additional detail text (optional)
     * @param life - Auto-dismiss time in milliseconds (default: 4000)
     */
    public showWarning(summary: string, detail: string = '', life: number = 4000): void {
        this.addMessage({
            id: this.generateId(),
            severity: 'warn',
            summary,
            detail,
            life,
        });
    }

    /**
     * Removes a specific toast message by ID
     * @param messageId - ID of the message to remove
     */
    public removeMessage(messageId: string): void {
        const currentMessages: ToastMessage[] = this.messagesSubject.value;
        const updatedMessages: ToastMessage[] = currentMessages.filter((msg: ToastMessage) => msg.id !== messageId);
        this.messagesSubject.next(updatedMessages);
    }

    /**
     * Clears all toast messages
     */
    public clearAll(): void {
        this.messagesSubject.next([]);
    }

    /**
     * Adds a new toast message to the queue
     * @param message - Toast message to add
     */
    private addMessage(message: ToastMessage): void {
        const currentMessages: ToastMessage[] = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, message]);

        if (message.life && message.life > 0) {
            setTimeout(() => {
                this.removeMessage(message.id);
            }, message.life);
        }
    }

    /**
     * Generates a unique ID for toast messages
     * @returns Unique identifier string
     */
    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
