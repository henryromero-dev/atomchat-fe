import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

/**
 * ToolbarComponent - Shared toolbar component for the application
 * 
 * This component provides a reusable toolbar that displays application information
 * and user actions. It's designed to be used across different pages and components.
 * 
 * Features:
 * - Configurable title display
 * - User email display
 * - Logout functionality
 * - Responsive design
 * - Event emission for parent components
 * 
 * @example
 * ```html
 * <app-toolbar
 *   [title]="'AtomChat'"
 *   [userEmail]="currentUser?.email"
 *   [showLogoutButton]="true"
 *   (logout)="onLogout()">
 * </app-toolbar>
 * ```
 */
@Component({
    selector: 'app-toolbar',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ButtonModule,
    ],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
    /** Application title to display in the toolbar */
    @Input() title: string = '';
    
    /** Current user's email to display */
    @Input() userEmail: string | null = null;
    
    /** Whether to show the logout button */
    @Input() showLogoutButton: boolean = true;

    /** Event emitted when logout button is clicked */
    @Output() logout: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Handles logout button click
     * Emits the logout event to the parent component
     */
    public onLogout(): void {
        this.logout.emit();
    }
}
