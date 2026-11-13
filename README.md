# Playwright End-to-End Test Automation

![CI](https://github.com/mc-solo/playwright-end-to-end-test-automation/actions/workflows/ci.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-1.61.1-45ba4b)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Node](https://img.shields.io/badge/Node-20-green)

A clean, well-organised Playwright (TypeScript) test project covering UI and API testing, with CI on GitHub Actions and reporting for Jira Xray and Allure.

Built as proof of work for junior / mid level SDET roles. It shows strong fundamentals: Page Object Model, clear test data, API checks with status and schema assertions, and a CI pipeline that runs on every push and on a daily schedule.

## What it tests

All tests run against public demo targets only. There is no private backend, and no work or client system is used here.

| Area | Target | Tests |
| --- | --- | --- |
| UI | https://demo.playwright.dev/todomvc | 13 |
| API | https://jsonplaceholder.typicode.com | 13 |
| **Total** | | **26** |

### UI tests (13)

`tests/ui/todo-crud.spec.ts` (8)

- Add a single todo, add multiple todos
- Mark a todo completed, then unmark it
- Delete a todo, edit a todo title
- Empty input does not add a todo
- Todos stay after a page reload

`tests/ui/todo-filters.spec.ts` (5)

- Active filter, Completed filter, All filter
- Clear completed removes only completed todos
- Items-left counter updates as todos are completed

### API tests (13)

`tests/api/posts.spec.ts` (7)

- `GET /posts/1` returns one post with the expected fields
- `GET /posts` returns 100 posts
- `GET /posts?userId=1` returns 10 posts, all from user 1
- `POST /posts` creates a post (201, id 101)
- `PUT /posts/1` replaces a post (200)
- `PATCH /posts/1` updates only the title
- `DELETE /posts/1` returns 200 with an empty body

`tests/api/users-todos.spec.ts` (6)

- `GET /users/1` returns the expected user
- `GET /users` returns 10 users with valid emails
- `GET /todos/1` returns a todo with a boolean `completed` flag
- `GET /posts/1/comments` returns 5 comments for post 1
- `GET /posts/9999` returns 200 with an empty object (documents the real API behaviour)
- `GET /invalid-route` returns 404

## Project structure

```text
.
├── .github/workflows/ci.yml   # CI: push, pull request, daily cron, manual run
├── playwright.config.ts        # Projects, retries, reporters, Xray + Allure
├── src/
│   ├── data/test-data.ts       # Shared test data
│   ├── pages/TodoPage.ts       # Page Object for the TodoMVC app
│   └── utils/
│       ├── api-helpers.ts      # Post shape and email checks
│       └── xray.ts             # test_key annotation helper
└── tests/
    ├── api/                    # JSONPlaceholder API tests
    └── ui/                     # TodoMVC UI tests
```

## How to run locally

Requirements: Node.js 20+, npm.

```bash
npm install
npx playwright install chromium
npm test
```

Run one part only:

```bash
npm run test:ui    # UI tests only
npm run test:api   # API tests only
```

View the Allure report:

```bash
npm run test:report
npm run test:report:open
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm test` | Full suite, headless |
| `npm run test:ui` | UI project only |
| `npm run test:api` | API project only |
| `npm run test:report` | Generate the Allure report from `allure-results` |
| `npm run typecheck` | `tsc --noEmit` |

## CI

Workflow: `.github/workflows/ci.yml`

- Runs on push to `main` and on pull requests to `main`
- Daily run at **06:00 UTC** (`cron: '0 6 * * *'`)
- Manual run from the Actions tab (`workflow_dispatch`)
- Node 20, `npm ci`, Chromium install, then `npm test`
- On every run it uploads three artifacts (kept 30 days): the Xray JUnit XML, the Allure results, and the Playwright test results

## Xray reporting

Results are written to `test-results/xray-results.xml` by `@xray-app/playwright-junit-reporter`, with `embedAnnotationsAsProperties: true`. Note: that XML file was **not** produced in the two local runs on 2026-11-13, even though the reporter is configured and Allure results were written. That is an open gap to check in CI before relying on the Xray import step.

Each test carries a `test_key` annotation (see `src/utils/xray.ts`), for example:

```ts
test('adds a single todo to the list', { annotation: xray('SAMPLE-1') }, async ({ page }) => {
  // ...
});
```

The keys in this repo (`SAMPLE-1` to `SAMPLE-26`) are placeholders. Replace them with real Jira Test issue keys when wiring the suite to a real Jira project.

To import the XML into Xray Cloud, get a token and POST the file to the JUnit import endpoint (see the commented-out step in `.github/workflows/ci.yml`). That step stays off by default because it needs real Xray credentials stored as repository secrets.

Allure results are written to `allure-results/` by `allure-playwright`.

## Verified locally

- Playwright **1.61.1**, Node **v24.22.1**, Linux, headless Chromium
- `npm install` completed, `npx tsc --noEmit` passed with no errors
- Full suite run on this machine (2026-11-13): **26 tests total, 0 passed, 26 failed**
- The failures were network errors, not test logic: every test hit `write EPROTO ... SSL routines:tls_validate_record_header:wrong version number` when Playwright tried to reach the two public demo sites. `curl` from the same machine reached both sites in the same check (`jsonplaceholder.typicode.com` returned 200, `demo.playwright.dev/todomvc` returned 301), so the sites were up and the failure is specific to how Playwright connects through this machine's network setup. The tests have **not** passed locally yet. Run them in CI (GitHub Actions) or on a network without this issue to get a clean pass count, and update this section with the result.

## Notes

- UI tests use the public TodoMVC demo made for Playwright testing.
- API tests use JSONPlaceholder, a free fake REST API. `POST`, `PUT`, `PATCH`, and `DELETE` calls return fake success responses and do not change real data.
- No real user data, no work system, and no client system is used or claimed here.
