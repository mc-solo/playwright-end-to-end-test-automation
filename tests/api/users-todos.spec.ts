import { test, expect } from '@playwright/test';
import { EXPECTED_USER_1 } from '../../src/data/test-data';
import { expectValidEmail } from '../../src/utils/api-helpers';
import { xray } from '../../src/utils/xray';

test(
  'GET /users/1 returns the expected user',
  { annotation: xray('SAMPLE-21') },
  async ({ request }) => {
    const response = await request.get('/users/1');
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user.id).toBe(EXPECTED_USER_1.id);
    expect(user.name).toBe(EXPECTED_USER_1.name);
    expect(user.username).toBe(EXPECTED_USER_1.username);
    expect(user.email).toBe(EXPECTED_USER_1.email);
  },
);

test(
  'GET /users returns 10 users with valid emails',
  { annotation: xray('SAMPLE-22') },
  async ({ request }) => {
    const response = await request.get('/users');
    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(users).toHaveLength(10);
    for (const user of users) {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expectValidEmail(user.email);
    }
  },
);

test(
  'GET /todos/1 returns a todo with a boolean completed flag',
  { annotation: xray('SAMPLE-23') },
  async ({ request }) => {
    const response = await request.get('/todos/1');
    expect(response.status()).toBe(200);
    const todo = await response.json();
    expect(todo.id).toBe(1);
    expect(todo.userId).toBe(1);
    expect(typeof todo.title).toBe('string');
    expect(typeof todo.completed).toBe('boolean');
  },
);

test(
  'GET /posts/1/comments returns 5 comments for post 1',
  { annotation: xray('SAMPLE-24') },
  async ({ request }) => {
    const response = await request.get('/posts/1/comments');
    expect(response.status()).toBe(200);
    const comments = await response.json();
    expect(comments).toHaveLength(5);
    for (const comment of comments) {
      expect(comment.postId).toBe(1);
      expectValidEmail(comment.email);
    }
  },
);

test(
  'GET /posts/9999 returns 200 with an empty object for a missing post',
  { annotation: xray('SAMPLE-25') },
  async ({ request }) => {
    // JSONPlaceholder returns {} with 200 for an id that does not exist.
    // This test documents that real behaviour instead of assuming a 404.
    const response = await request.get('/posts/9999');
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({});
  },
);

test(
  'GET /invalid-route returns 404',
  { annotation: xray('SAMPLE-26') },
  async ({ request }) => {
    const response = await request.get('/invalid-route');
    expect(response.status()).toBe(404);
  },
);
