import { test, expect } from '@playwright/test';
import { TodoPage } from '../../src/pages/TodoPage';
import { TODO_TITLES } from '../../src/data/test-data';
import { xray } from '../../src/utils/xray';

test.beforeEach(async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
});

test(
  'adds a single todo to the list',
  { annotation: xray('SAMPLE-1') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo(TODO_TITLES.single);
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.getItemsLeftText()).resolves.toContain('1 item left');
  },
);

test(
  'adds multiple todos and shows the correct count',
  { annotation: xray('SAMPLE-2') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodos([...TODO_TITLES.multiple]);
    await expect(todoPage.todoItems).toHaveCount(3);
    await expect(todoPage.getItemsLeftText()).resolves.toContain('3 items left');
  },
);

test(
  'marks a todo as completed',
  { annotation: xray('SAMPLE-3') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo(TODO_TITLES.toComplete);
    await todoPage.toggleTodo(TODO_TITLES.toComplete);
    await todoPage.expectTodoCompleted(TODO_TITLES.toComplete);
    await expect(todoPage.getItemsLeftText()).resolves.toContain('0 items left');
  },
);

test(
  'unmarks a completed todo back to active',
  { annotation: xray('SAMPLE-4') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo(TODO_TITLES.toComplete);
    await todoPage.toggleTodo(TODO_TITLES.toComplete);
    await todoPage.untoggleTodo(TODO_TITLES.toComplete);
    await todoPage.expectTodoNotCompleted(TODO_TITLES.toComplete);
    await expect(todoPage.getItemsLeftText()).resolves.toContain('1 item left');
  },
);

test(
  'deletes a todo from the list',
  { annotation: xray('SAMPLE-5') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodos([TODO_TITLES.toDelete, TODO_TITLES.single]);
    await todoPage.deleteTodo(TODO_TITLES.toDelete);
    await expect(todoPage.todoItems).toHaveCount(1);
    await todoPage.expectTodoVisible(TODO_TITLES.single);
  },
);

test(
  'edits a todo title',
  { annotation: xray('SAMPLE-6') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo(TODO_TITLES.toEdit);
    await todoPage.editTodo(TODO_TITLES.toEdit, TODO_TITLES.edited);
    await expect(todoPage.todoItems).toHaveCount(1);
  },
);

test(
  'does not add an empty todo',
  { annotation: xray('SAMPLE-7') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.newTodoInput.press('Enter');
    await expect(todoPage.todoItems).toHaveCount(0);
  },
);

test(
  'keeps todos after a page reload',
  { annotation: xray('SAMPLE-8') },
  async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo(TODO_TITLES.single);
    await page.reload();
    await todoPage.expectTodoVisible(TODO_TITLES.single);
    await expect(todoPage.todoItems).toHaveCount(1);
  },
);
