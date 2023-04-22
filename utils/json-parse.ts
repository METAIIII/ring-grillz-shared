import { Prisma } from '@prisma/client';

// Overload signatures
export function json<T>(data: undefined | null): Partial<T>;
export function json<T>(data: string | object | Prisma.JsonValue): T;

export function json<T>(
  data?: string | object | Prisma.JsonValue | undefined | null
): T | Partial<T> {
  if (!data) {
    return {} as Partial<T>;
  } else if (typeof data === 'string') {
    return JSON.parse(data) as T;
  } else {
    return JSON.parse(JSON.stringify(data)) as T;
  }
}
