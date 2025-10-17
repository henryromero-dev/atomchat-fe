import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * AppComponent - Root component of the AtomChat Frontend application
 * 
 * This is the main entry point component that serves as the root of the Angular application.
 * It provides the basic layout structure and handles routing through the RouterOutlet.
 * 
 * Features:
 * - Root component with router outlet for navigation
 * - Standalone component architecture
 * - Minimal component focused on routing
 * 
 * @example
 * ```html
 * <app-root></app-root>
 * ```
 */
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
}
