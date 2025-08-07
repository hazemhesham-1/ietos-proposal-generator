import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isValidJSON(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
}