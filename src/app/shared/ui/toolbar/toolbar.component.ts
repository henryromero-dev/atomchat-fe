import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

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
    @Input() title: string = '';
    @Input() userEmail: string | null = null;
    @Input() showLogoutButton: boolean = true;

    @Output() logout: EventEmitter<void> = new EventEmitter<void>();

    public onLogout(): void {
        this.logout.emit();
    }
}
