import { test, expect } from '@playwright/test';
import { TodoPage } from '../../src/pages/TodoPage';
import { TODO_TITLES } from '../../src/data/test-data';
import { xray } from '../../src/utils/xray';

test.beforeEach(async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  await todoPage.addTodo(TODO_TITLES.active);
  await todoPage.addTodo(TODO_TITLES.completed);
  await todoPage.toggleTodo(TODO_TITLES.completed);
});

test(
  'Active filter shows only active todos',
  { annotation: xray('SAMPLE-9') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.filterBy('Active');
    await expect(todoPage.todoItems).toHaveCount(1);
    await todoPage.expectTodoVisible(TODO_TITLES.active);
  },
);

test(
  'Completed filter shows only completed todos',
  { annotation: xray('SAMPLE-10') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.filterBy('Completed');
    await expect(todoPage.todoItems).toHaveCount(1);
    await todoPage.expectTodoVisible(TODO_TITLES.completed);
  },
);

test(
  'All filter shows every todo',
  { annotation: xray('SAMPLE-11') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.filterBy('Active');
    await expect(todoPage.todoItems).toHaveCount(1);
    await todoPage.filterBy('All');
    await expect(todoPage.todoItems).toHaveCount(2);
  },
);

test(
  'Clear completed removes only completed todos',
  { annotation: xray('SAMPLE-12') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.clearCompleted();
    await expect(todoPage.todoItems).toHaveCount(1);
    await todoPage.expectTodoVisible(TODO_TITLES.active);
  },
);

test(
  'items-left counter updates as todos are completed',
  { annotation: xray('SAMPLE-13') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await expect(todoPage.getItemsLeftText()).resolves.toContain('1 item left');
    await todoPage.toggleTodo(TODO_TITLES.active);
    await expect(todoPage.getItemsLeftText()).resolves.toContain('0 items left');
  },
);
