/** Shared test data. Kept separate from tests so values are easy to find and reuse. */

export const TODO_TITLES = {
  single: 'Buy milk',
  multiple: ['Write tests', 'Review pull request', 'Run the suite'],
  toComplete: 'Finish the report',
  toDelete: 'Old task to remove',
  toEdit: 'Fix typo in docs',
  edited: 'Fix typo in docs (updated)',
  active: 'Still to do',
  completed: 'Already done',
} as const;

export const NEW_POST = {
  title: 'Playwright API test post',
  body: 'Created by an automated API test against JSONPlaceholder.',
  userId: 1,
} as const;

export const UPDATED_POST = {
  id: 1,
  title: 'Updated title from API test',
  body: 'Updated body from API test.',
  userId: 1,
} as const;

export const EXPECTED_USER_1 = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
} as const;
