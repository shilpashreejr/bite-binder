import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizePlainText(input: string) {
  return input.replace(/[<>]/g, "");
}

export function getUserId(request: Request) {
  return request.headers.get("x-user-id") ?? "guest";
}
