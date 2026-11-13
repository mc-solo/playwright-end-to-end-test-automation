import { expect } from '@playwright/test';

/** Minimal shape checks shared by the API tests. */

export interface JsonPlaceholderPost {
  body: string;
  id: number;
  title: string;
  userId: number;
}

export function expectPostShape(post: unknown): asserts post is JsonPlaceholderPost {
  expect(post).toHaveProperty('id');
  expect(post).toHaveProperty('userId');
  expect(post).toHaveProperty('title');
  expect(post).toHaveProperty('body');
  const p = post as JsonPlaceholderPost;
  expect(typeof p.id).toBe('number');
  expect(typeof p.userId).toBe('number');
  expect(typeof p.title).toBe('string');
  expect(typeof p.body).toBe('string');
}

export function expectValidEmail(email: string): void {
  expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}
