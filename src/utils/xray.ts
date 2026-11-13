/**
 * Xray annotation helper.
 *
 * Each test carries a `test_key` annotation. The Xray JUnit reporter
 * (`@xray-app/playwright-junit-reporter`, configured in
 * playwright.config.ts with `embedAnnotationsAsProperties: true`)
 * writes it into test-results/xray-results.xml as a property, so the
 * result can be imported into Jira Xray and linked to an existing
 * Test issue.
 *
 * The keys below (SAMPLE-1, SAMPLE-2, ...) are placeholders.
 * Replace them with real Jira Test issue keys (for example VBMSTM-45038)
 * when this suite is wired to a real Jira project. No real project,
 * issue, or client system is claimed here.
 */
export function xray(testKey: string) {
  return [{ type: 'test_key', description: testKey }];
}
