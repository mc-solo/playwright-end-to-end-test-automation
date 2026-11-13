import { test, expect } from '@playwright/test';
import { NEW_POST, UPDATED_POST } from '../../src/data/test-data';
import { expectPostShape } from '../../src/utils/api-helpers';
import { xray } from '../../src/utils/xray';

test(
  'GET /posts/1 returns one post with the expected fields',
  { annotation: xray('SAMPLE-14') },
  async ({ request }) => {
    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);
    const post = await response.json();
    expectPostShape(post);
    expect(post.id).toBe(1);
    expect(post.userId).toBe(1);
    expect(post.title).toBe(
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    );
  },
);

test(
  'GET /posts returns 100 posts',
  { annotation: xray('SAMPLE-15') },
  async ({ request }) => {
    const response = await request.get('/posts');
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(posts).toHaveLength(100);
    expectPostShape(posts[0]);
  },
);

test(
  'GET /posts?userId=1 returns only posts from user 1',
  { annotation: xray('SAMPLE-16') },
  async ({ request }) => {
    const response = await request.get('/posts', { params: { userId: '1' } });
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(posts).toHaveLength(10);
    for (const post of posts) {
      expect(post.userId).toBe(1);
    }
  },
);

test(
  'POST /posts creates a post and returns 201',
  { annotation: xray('SAMPLE-17') },
  async ({ request }) => {
    const response = await request.post('/posts', { data: NEW_POST });
    expect(response.status()).toBe(201);
    const post = await response.json();
    expect(post.title).toBe(NEW_POST.title);
    expect(post.body).toBe(NEW_POST.body);
    expect(post.userId).toBe(NEW_POST.userId);
    expect(post.id).toBe(101);
  },
);

test(
  'PUT /posts/1 replaces a post and returns 200',
  { annotation: xray('SAMPLE-18') },
  async ({ request }) => {
    const response = await request.put('/posts/1', { data: UPDATED_POST });
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post.title).toBe(UPDATED_POST.title);
    expect(post.body).toBe(UPDATED_POST.body);
    expect(post.id).toBe(1);
  },
);

test(
  'PATCH /posts/1 updates only the title',
  { annotation: xray('SAMPLE-19') },
  async ({ request }) => {
    const response = await request.patch('/posts/1', {
      data: { title: 'Patched title from API test' },
    });
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post.title).toBe('Patched title from API test');
    expect(post.id).toBe(1);
  },
);

test(
  'DELETE /posts/1 returns 200 with an empty body',
  { annotation: xray('SAMPLE-20') },
  async ({ request }) => {
    const response = await request.delete('/posts/1');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual({});
  },
);
