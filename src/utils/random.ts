import { randomUUID } from "node:crypto";

/** Returns a short unique suffix, so records created by parallel runs don't collide. */
export function uniqueSuffix(): string {
  return randomUUID().slice(0, 8);
}

/** Returns a unique string such as "qa-title-3f9a1c2b". */
export function uniqueString(prefix: string): string {
  return `${prefix}-${uniqueSuffix()}`;
}

/** Returns a random integer in the inclusive range [min, max]. */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
