import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Spajanje Tailwind klasa (kao u shadcn) - koristi ga mapa (components/ui/map.tsx) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
