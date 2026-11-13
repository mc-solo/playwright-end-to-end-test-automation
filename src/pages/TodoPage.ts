import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object for the TodoMVC demo app.
 * https://demo.playwright.dev/todomvc
 *
 * Keeps selectors and common actions in one place so tests stay
 * short and readable. If the app changes, only this file changes.
 */
export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.locator('.todo-list li');
    this.todoCount = page.locator('.todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.newTodoInput).toBeVisible();
  }

  todoItem(title: string): Locator {
    return this.todoItems.filter({ hasText: title }).first();
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
    await expect(this.todoItem(title)).toBeVisible();
  }

  async addTodos(titles: string[]): Promise<void> {
    for (const title of titles) {
      await this.addTodo(title);
    }
  }

  async toggleTodo(title: string): Promise<void> {
    await this.todoItem(title).locator('.toggle').check();
  }

  async untoggleTodo(title: string): Promise<void> {
    await this.todoItem(title).locator('.toggle').uncheck();
  }

  async deleteTodo(title: string): Promise<void> {
    const item = this.todoItem(title);
    await item.hover();
    await item.locator('.destroy').click({ force: true });
    await expect(item).toHaveCount(0);
  }

  async editTodo(oldTitle: string, newTitle: string): Promise<void> {
    const item = this.todoItem(oldTitle);
    await item.locator('label').dblclick();
    const editInput = item.locator('.edit');
    await editInput.fill(newTitle);
    await editInput.press('Enter');
    await expect(this.todoItem(newTitle)).toBeVisible();
  }

  async filterBy(filter: 'All' | 'Active' | 'Completed'): Promise<void> {
    await this.page.getByRole('link', { name: filter, exact: true }).click();
  }

  async clearCompleted(): Promise<void> {
    await this.clearCompletedButton.click();
  }

  async getTodoCount(): Promise<number> {
    return this.todoItems.count();
  }

  async getItemsLeftText(): Promise<string> {
    return (await this.todoCount.textContent()) ?? '';
  }

  async expectTodoVisible(title: string): Promise<void> {
    await expect(this.todoItem(title)).toBeVisible();
  }

  async expectTodoCompleted(title: string): Promise<void> {
    await expect(this.todoItem(title)).toHaveClass(/completed/);
  }

  async expectTodoNotCompleted(title: string): Promise<void> {
    await expect(this.todoItem(title)).not.toHaveClass(/completed/);
  }
}
