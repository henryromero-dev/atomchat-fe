import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

const PRIMENG_MODULES = [
    ButtonModule,
    InputTextModule,
    CardModule,
    CheckboxModule,
    DialogModule,
    ToolbarModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    PaginatorModule,
    ProgressSpinnerModule,
    MessageModule,
    MessagesModule,
    DividerModule,
    BadgeModule,
    AvatarModule,
    ChipModule,
    TagModule,
    SkeletonModule,
    MenuModule,
    MenubarModule,
    SidebarModule,
    PanelModule,
    AccordionModule,
    TabViewModule,
    SplitterModule,
    ScrollPanelModule,
    OverlayPanelModule,
    TooltipModule,
    RippleModule,
];

const PRIMENG_SERVICES = [
    MessageService,
    ConfirmationService,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ...PRIMENG_MODULES,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ...PRIMENG_MODULES,
    ],
    providers: [
        ...PRIMENG_SERVICES,
    ],
})
export class UiModule { }
