import React, { useEffect, useState } from 'react';
import format from 'date-fns/format';

// see https://usehooks-ts.com/react-hook/use-debounce
export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function capitalizeWord(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function getAsString(value: string | string[]): string {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

export function stringToColor(string: string): string {
    let hash = 0;
    let i: number;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function stringAvatar(name: string, fontSize: number = 12, width: number = 60, height: number = 60) {
    const upper = name.toUpperCase();
    return {
        sx: {
            bgcolor: stringToColor(name),
            fontSize,
            width,
            height
        },
        children: `${upper.split(' ')[0][0]}${upper.split(' ')[1][0]}`
    };
}

export function dateToString(date: Date | string): string {
    if (date instanceof Date) {
        return format(date, 'yyy-MM-dd');
    }
    return date;
}
