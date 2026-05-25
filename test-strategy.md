# Test Strategy

## What I Chose to Cover and Why

### UI Tests
- **Login flow** — highest user-facing risk; broken auth blocks everything else
- **Dashboard** — verifies the post-login state is correct
- **Form validation** — catches regressions in client-side validation rules
- **Cross-browser smoke** — runs on Chromium, Firefox, and WebKit to catch
  rendering differences early without duplicating the full suite

### API Tests
- **Room CRUD** — core business operation; most likely to break on backend changes
- **Schema validation with Zod** — catches silent contract changes where the
  shape of the response changes without a status code change
- **Authentication flows** — 401 on missing token, valid token accepted
- **Error handling (4xx)** — missing fields return 400, bad IDs return 404
- **Response time assertions** — baseline performance regression detection

### Integration Tests
- **API-create → UI-verify** — proves the UI and API agree on the same data;
  this is the class of bug that pure unit or pure E2E tests miss

---

## What I Would Cover Next

- Booking creation and cancellation flows end-to-end
- Payment and pricing edge cases
- Mobile viewport smoke tests using Playwright device emulation
- Negative integration flows — create via API, assert correct error in UI
- Session expiry behaviour — what happens when the token expires mid-session
- Accessibility checks using axe-playwright on key pages

---

## Top 3 Risks I Would Flag to the Team

### Risk 1 — Short-lived auth tokens cause flakiness in slow CI
The site issues tokens that expire within seconds. Any test that logs in and
then does slow setup before making an authenticated request will get a 401.
Current mitigation: login as the very last step before the request.
Better fix: implement token refresh or increase token TTL in the test environment.

### Risk 2 — No test data teardown
Rooms created during test runs accumulate in the database across runs. Over time
this causes test pollution — tests that search for a specific room name may find
multiple matches and produce false positives or ordering-dependent failures.
Fix: add afterEach hooks that delete rooms created during each test using the
room ID returned from the create response.

### Risk 3 — No contract tests between UI and API
The Zod schema validation catches shape changes in responses, but it does not
catch cases where the UI sends a request the API no longer accepts — for example,
a renamed field. A breaking API change can pass all API tests and all UI tests
independently but fail in production.
Fix: add Pact contract tests to verify the UI's expectations of the API are
explicitly tested at the contract level.

---

## Improvement Plan

| Priority | Improvement | Effort |
|----------|-------------|--------|
| High | Test data teardown after each test | 1 day |
| High | Retry logic for flaky network requests | Half day |
| Medium | Contract testing with Pact | 2 days |
| Medium | Visual regression on key pages | 1 day |
| Low | Performance baseline with k6 | 2 days |
| Low | Accessibility audit with axe | 1 day |