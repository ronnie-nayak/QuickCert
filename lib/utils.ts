import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  if (!str) return '';
  let list = str.split(' ');
  for (let i = 0; i < list.length; i++) {
    list[i] = list[i].charAt(0).toUpperCase() + list[i].slice(1);
  }
  return list.join(' ');
}

export function underscoreToSpace(str: string) {
  let list = str.split('_');
  for (let i = 0; i < list.length; i++) {
    list[i] = capitalize(list[i]);
  }
  return list.join(' ');
}
