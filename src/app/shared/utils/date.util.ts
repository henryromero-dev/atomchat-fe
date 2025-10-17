/**
 * Date utility functions for consistent date handling across the application
 */

export interface DateFormatOptions {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
    hour12?: boolean;
    timeZone?: string;
}

export class DateUtil {
    private static readonly DEFAULT_LOCALE = 'en-US';
    private static readonly DEFAULT_TIMEZONE = 'UTC';

    /**
     * Format a date using Intl.DateTimeFormat
     */
    static format(
        date: Date | string | number,
        options: DateFormatOptions = {},
        locale: string = this.DEFAULT_LOCALE
    ): string {
        const dateObj = this.toDate(date);
        if (!dateObj) return '';

        const defaultOptions: DateFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: this.DEFAULT_TIMEZONE,
        };

        const formatOptions = { ...defaultOptions, ...options };

        return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
    }

    /**
     * Format date for display (e.g., "Jan 15, 2024")
     */
    static formatDisplay(date: Date | string | number): string {
        return this.format(date, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    /**
     * Format date and time for display (e.g., "Jan 15, 2024 at 2:30 PM")
     */
    static formatDateTime(date: Date | string | number): string {
        return this.format(date, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    /**
     * Format time only (e.g., "2:30 PM")
     */
    static formatTime(date: Date | string | number): string {
        return this.format(date, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    /**
     * Format relative time (e.g., "2 hours ago", "yesterday")
     */
    static formatRelative(date: Date | string | number): string {
        const dateObj = this.toDate(date);
        if (!dateObj) return '';

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) {
            return 'yesterday';
        }

        if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        }

        if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
        }

        if (diffInDays < 365) {
            const months = Math.floor(diffInDays / 30);
            return `${months} month${months === 1 ? '' : 's'} ago`;
        }

        const years = Math.floor(diffInDays / 365);
        return `${years} year${years === 1 ? '' : 's'} ago`;
    }

    /**
     * Check if a date is today
     */
    static isToday(date: Date | string | number): boolean {
        const dateObj = this.toDate(date);
        if (!dateObj) return false;

        const today = new Date();
        return (
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear()
        );
    }

    /**
     * Check if a date is yesterday
     */
    static isYesterday(date: Date | string | number): boolean {
        const dateObj = this.toDate(date);
        if (!dateObj) return false;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        return (
            dateObj.getDate() === yesterday.getDate() &&
            dateObj.getMonth() === yesterday.getMonth() &&
            dateObj.getFullYear() === yesterday.getFullYear()
        );
    }

    /**
     * Convert various date formats to Date object
     */
    private static toDate(date: Date | string | number): Date | null {
        if (date instanceof Date) {
            return date;
        }

        if (typeof date === 'string' || typeof date === 'number') {
            const parsed = new Date(date);
            return isNaN(parsed.getTime()) ? null : parsed;
        }

        return null;
    }

    /**
     * Get start of day
     */
    static startOfDay(date: Date | string | number): Date | null {
        const dateObj = this.toDate(date);
        if (!dateObj) return null;

        const startOfDay = new Date(dateObj);
        startOfDay.setHours(0, 0, 0, 0);
        return startOfDay;
    }

    /**
     * Get end of day
     */
    static endOfDay(date: Date | string | number): Date | null {
        const dateObj = this.toDate(date);
        if (!dateObj) return null;

        const endOfDay = new Date(dateObj);
        endOfDay.setHours(23, 59, 59, 999);
        return endOfDay;
    }

    /**
     * Add days to a date
     */
    static addDays(date: Date | string | number, days: number): Date | null {
        const dateObj = this.toDate(date);
        if (!dateObj) return null;

        const result = new Date(dateObj);
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * Get difference in days between two dates
     */
    static diffInDays(date1: Date | string | number, date2: Date | string | number): number | null {
        const d1 = this.toDate(date1);
        const d2 = this.toDate(date2);

        if (!d1 || !d2) return null;

        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}
