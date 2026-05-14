import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para mesclar classes Tailwind de forma condicional e eficiente.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
