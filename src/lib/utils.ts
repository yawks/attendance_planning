import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateHslColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  // Use fixed saturation and lightness for pleasant, consistent colors
  return `hsl(${h}, 60%, 80%)`;
}

export function getInitials(name: string): string {
  const names = name.split(' ');
  const firstName = names[0] ?? '';
  const lastName = names.length > 1 ? names[names.length - 1] : '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
