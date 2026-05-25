# Test Strategy & Framework Architecture

## Overview

This document outlines the comprehensive test framework built for the Restful Booker Admin Platform. The framework employs industry best practices including the Page Object Model, data-driven testing, multi-layer test coverage (UI, API, Integration), and automated reporting.

---

## Test Framework Philosophy

**Goal**: Build a maintainable, scalable, extensible framework that enables any engineer to onboard quickly and add tests confidently.

**Core Principles**:
1. **Page Object Model** — Encapsulates UI selectors; tests are selector-agnostic
2. **Data-Driven** — Test scenarios externalised in JSON; parameterized across multiple datasets
3. **Multi-Layer** — UI, API, and Integration tests provide defense-in-depth coverage
4. **Reporting** — Integrated Allure + Playwright HTML reports with screenshots and logs
5. **Reusability** — Custom utilities for waits, retries, assertions reduce duplication
6. **Cross-Browser** — Smoke and regression tests run on Chromium, Firefox, and WebKit

---

## Layers of Coverage

### 1. UI Tests (`tests/ui/`)

**Purpose**: Verify user-facing functionality, workflows, and form interactions.

#### 1.1 Authentication Tests (`auth.spec.ts`)
- ✅ **Login form validation** — required fields, input constraints, form state
- ✅ **Successful login flow** — valid credentials, session persistence, URL navigation
- ✅ **Failed login scenarios** — invalid password, missing credentials, error messaging
- ✅ **Session management** — multiple logins, form clearing and refilling
- **Coverage**: ~12 tests
- **Data Source**: `test-data/user.json`

#### 1.2 Dashboard Tests (`dashboard.spec.ts`)
- ✅ **Room list rendering** — list visibility, room count, table structure
- ✅ **Room visibility** — room names appear, search/filter functionality
- ✅ **Page navigation** — correct URL, page title, navbar presence
- ✅ **UI element accessibility** — buttons enabled, interactive elements clickable
- ✅ **Responsive design** — desktop viewport renders correctly
- **Coverage**: ~15 tests
- **Fixtures**: `loggedPage`, `dashboardPage` (auth via session storage)

#### 1.3 Cross-Browser Smoke Tests (`smoke.spec.ts`)
- ✅ **Homepage** — page loads, title, navbar, navigation links
- ✅ **Admin login page** — form fields visible, inputs accepted, page accessible
- ✅ **Performance baseline** — pages load within 5 seconds
- ✅ **Cross-browser compatibility** — tests run on Chrome, Firefox, Safari
- **Coverage**: ~12 tests per browser (36+ total)
- **Browsers**: `chromium`, `firefox`, `webkit` (via Playwright config)
- **Note**: No auth required; tests public pages

---

### 2. API Tests (`tests/api/`)

**Purpose**: Verify API contracts, data persistence, error handling, and performance.

#### 2.1 CRUD Operations (`booking.spec.ts`)
**CREATE**:
- ✅ Create room returns 200, success flag, valid room ID
- ✅ Created room persists with all submitted fields
- ✅ Data-driven valid room scenarios (suite, single, double, twin, luxury)
- **Coverage**: ~8 tests

**READ**:
- ✅ List rooms returns valid schema (Zod-validated)
- ✅ Room list contains array of rooms with valid data
- ✅ Get single room by ID returns correct data
- ✅ Each room matches room schema (roomid, roomName, type, etc.)
- **Coverage**: ~5 tests

**UPDATE**:
- ✅ Create then verify data persists across multiple fetches
- **Coverage**: ~1 test

**DELETE**:
- ✅ Delete room successfully
- **Coverage**: ~1 test

**Performance**:
- ✅ Room list responds within 2000ms
- ✅ Single room fetch responds within 2000ms
- ✅ Create room responds within 3000ms
- **Coverage**: ~3 tests

#### 2.2 Error Handling (`errors.spec.ts`)
**4xx Client Errors**:
- ✅ 404: Non-existent room returns error
- ✅ 400/422: Invalid payloads rejected
- ✅ 400: Invalid price format, malformed JSON
- ✅ 404: Delete non-existent room
- **Coverage**: ~6 tests

**Authentication**:
- ✅ 401: Unauthenticated requests rejected
- ✅ 401: Invalid token rejected
- **Coverage**: ~2 tests

**Response Codes**:
- ✅ 200: Successful operations return 200
- ✅ 4xx: Client errors in 400-499 range
- **Coverage**: ~2 tests

**Response Validation**:
- ✅ Error responses have descriptive messages
- ✅ Successful responses have expected structure
- **Coverage**: ~2 tests

**Performance Under Load**:
- ✅ Concurrent requests complete within 5s
- ✅ Response times consistent across retries
- **Coverage**: ~2 tests

**Edge Cases**:
- ✅ Very large room IDs
- ✅ Very long room names
- ✅ Special characters in names
- **Coverage**: ~3 tests

**Schema Validation** (via Zod):
- ✅ Room list matches schema
- ✅ Individual rooms match schema
- **Coverage**: ~2 tests

**Data-Driven Scenarios**:
- ✅ Invalid room scenarios from `test-data/invalidRooms.json`
- **Coverage**: ~6 parameterized tests

---

### 3. Integration Tests (`tests/integration/`)

**Purpose**: Verify end-to-end workflows combining UI and API layers.

#### 3.1 E2E Room Lifecycle (`e2e-room-lifecycle.spec.ts`)

**Test 1: Create Room via API, Verify in UI**
- ✅ **API → UI workflow**:
  1. POST /api/room with unique room name
  2. Extract room ID from response
  3. Login to admin dashboard (UI)
  4. Verify room appears in room list by name
  5. Assert room is visible using correct selectors
- **Coverage**: ~1 test
- **Fixtures**: `roomApi` (API), `page` + selectors (UI)
- **Data**: Runtime-generated unique room name (`Integration-{timestamp}`)

**Test 2: Data Consistency Across Layers**
- ✅ **API → UI data validation**:
  1. Fetch rooms list via API (GET /api/rooms)
  2. Extract first room details
  3. Navigate to dashboard UI
  4. Verify room count matches between API and UI
  5. Assert room data structures are consistent
- **Coverage**: ~1 test
- **Purpose**: Detect sync failures between backend and frontend

**Test 3: Error Handling Integration**
- ✅ **Error propagation verification**:
  1. Attempt invalid room creation via API (empty name, invalid price)
  2. Verify API returns 4xx error status
  3. Confirm error response has proper structure
  4. Assert no partial data persists
- **Coverage**: ~1 test
- **Purpose**: Ensure invalid data doesn't corrupt system state

**Test 4: Performance SLA Validation**
- ✅ **Cross-layer performance**:
  1. Measure CREATE response time (target: <3000ms)
  2. Measure LIST response time (target: <2000ms)
  3. Verify both operations meet SLA
  4. Log performance metrics for trend analysis
- **Coverage**: ~1 test
- **Purpose**: Catch performance regressions early

**Total Integration Test Coverage**: ~4 tests
**Execution Strategy**: Runs after API tests (dependency: data must exist) and UI tests (session must be established)
**Cross-Browser**: Yes (inherits browser selection from Chromium, Firefox projects in config)

---

## Test Data Strategy

### Data Organization

```
test-data/
├── user.json           # Login scenarios (valid, invalid username, invalid password)
├── rooms.json          # Valid room payloads (suite, single, double, twin, luxury)
└── invalidRooms.json   # Invalid payloads (missing fields, invalid types, etc.)
```

### Data-Driven Approach

**Example: Parameterized Room Creation**

```typescript
validRooms.forEach(({ scenario, payload, expectedStatus }) => {
  test(`Create: ${scenario}`, async ({ roomApi }) => {
    const response = await roomApi.createRoom(payload);
    assertStatus(response, expectedStatus, scenario);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
```

**Benefits**:
- Single test definition covers multiple scenarios
- New scenarios added via JSON, no code changes
- Clear failure reporting ("Valid double room failed" vs generic "create test failed")

### Utilities for Data Management

**`testDataHelpers.ts`**:
- `loadTestData(filename)` — Load JSON test data
- `generateUniqueData(fieldValue, prefix)` — Generate unique identifiers for runtime data
- `filterTestData(data, predicate)` — Filter scenarios (e.g., only invalid)
- `parameterizeTestData(baseData, variants)` — Create cartesian product of test cases
- `chunkTestData(data, size)` — Batch test data for iterative execution

---

## Design Patterns & Best Practices

### 1. Page Object Model (POM)

**Hierarchy**:
```
BasePage (abstract base with common utilities)
├── LoginPage (login-specific selectors and methods)
├── DashboardPage (dashboard-specific selectors and methods)
└── AdminPage (composes LoginPage + DashboardPage)
```

**Benefits**:
- Selectors centralized; changes don't ripple through tests
- Methods encapsulate workflows (e.g., `login()`, `openCreateForm()`)
- Improved readability: `loginPage.login(user, pass)` vs raw locator clicks

**Example**:
```typescript
// Page Object
class LoginPage extends BasePage {
  async login(user: string, pass: string) {
    await this.fillInput(this.usernameInput, user, 'Username');
    await this.fillInput(this.passwordInput, pass, 'Password');
    await this.clickElement(this.loginButton, 'Login Button');
  }
}

// Test
test('Valid login succeeds', async ({ loginPage }) => {
  await loginPage.login('admin', 'password');
  await loginPage.assertLoginSuccess();
});
```

### 2. Fixtures for Dependency Injection

**UI Fixtures** (`tests/fixtures/ui.fixture.ts`):
- `loggedPage` — Page authenticated via session storage
- `dashboardPage` — Pre-initialized DashboardPage on authenticated session
- `loginPage` — Fresh LoginPage (caller decides navigation)

**API Fixtures** (`tests/fixtures/api.fixture.ts`):
- `authedContext` — API request context with valid authentication token
- `roomApi` — Pre-initialized RoomApi for room endpoints

**Benefits**:
- Setup/teardown logic reused across tests
- Clear dependency declaration
- Easier to mock or override for testing

### 3. Custom Utilities

#### Wait Utilities (`waitUtils.ts`)
- `waitForVisible(locator, description, timeout)` — Descriptive waits with logging
- `waitForHidden(locator, description, timeout)`
- `waitForPageSettle(page, settleMs)` — Handles SPA transitions (Next.js, etc.)

#### Custom Assertions (`customAssertions.ts`)
- `assertResponseTime(fn, maxMs)` — Performance assertions with clear error messages
- `assertStatus(response, expectedStatus, context)` — Status code assertions
- `assertErrorResponse(response)` — Error response validation
- `assertSuccessResponse(response, context)` — Success response validation
- Additional helpers for headers, JSON, text content

#### UI Assertions (`uiAssertions.ts`)
- `assertElementVisible(locator, name, timeout)`
- `assertElementText(locator, expectedText, name)`
- `assertInputValue(locator, expectedValue, name)`
- And more for accessibility, styling, state

#### API Client (`apiClient.ts`)
- Reusable HTTP client for custom endpoints
- Methods: `get()`, `post()`, `delete()`
- Automatic logging for traceability

#### Retry Logic (`retry.ts`)
- `retry(fn, retries, delayMs)` — Retry async operations with exponential backoff
- Used for flaky network calls, eventual consistency testing

#### Logging (`logger.ts`)
- `logger.info()`, `logger.warn()`, `logger.error()`
- Logs to console AND Playwright annotations (captured in reports)

---

## Reporting & Artifacts

### Integrated Reporters

**Playwright HTML Report**:
- `playwright-report/index.html`
- Screenshots on failure, video recordings (on-failure), trace files
- Real-time execution dashboard

**Allure Report** (in CI only):
- `allure-results/`
- Trend analysis, test history, defect tracking
- Runs via `allure open allure-results` after test execution

### Test Execution & Reporting

```bash
# Run all tests, generate Playwright HTML + Allure (CI only)
npx playwright test

# Run specific test file
npx playwright test tests/ui/auth.spec.ts

# Run specific browser
npx playwright test --project=firefox

# Open HTML report
npx playwright show-report

# Generate Allure report (after test run)
allure generate allure-results -o allure-report && allure open allure-report
```

### Screenshot & Video Artifacts

- **Screenshots**: On failure (configured in `playwright.config.ts`)
- **Videos**: On failure (configured in `playwright.config.ts`)
- **Traces**: Full browser trace for debugging (on-failure mode)

---

## Coverage Summary

| Layer | Component | Count | Status |
|-------|-----------|-------|--------|
| **UI** | Authentication | 12 | ✅ Complete |
| **UI** | Dashboard | 15 | ✅ Complete |
| **UI** | Smoke (Cross-Browser) | 36+ | ✅ Complete |
| **API** | CRUD Operations | 19 | ✅ Complete |
| **API** | Error Handling | 24+ | ✅ Complete |
| **API** | Schema Validation | 2 | ✅ Complete |
| **Integration** | API-to-UI | 1 | ✅ Complete |
| **Total** | | **~108+** | ✅ |

---

## Execution Strategy

### Local Development

```bash
# Install dependencies
npm ci && npx playwright install

# Configure environment
cp .env.example .env
# Edit .env with local URLs and credentials

# Run all tests
npx playwright test

# Run in debug/headed mode (see browser)
npx playwright test --headed

# Run with inspector
npx playwright test --debug
```

### CI/CD Pipeline

```yaml
# Triggers on PR/push
- Run all tests (parallel, 4 workers)
- Collect Allure results
- Upload artifacts (HTML report, traces)
- Report test metrics
- Fail PR if any test fails
- Generate trend analysis
```

### Test Maintenance

- **Weekly**: Review flaky tests, update selectors if UI changes
- **Monthly**: Retire obsolete test data, archive old reports
- **Quarterly**: Refactor common patterns, upgrade dependencies

---

## What's Covered (Strengths)

✅ **Login flows** — Form validation, successful/failed scenarios, session management  
✅ **Dashboard interactions** — Room list display, visibility, navigation, accessibility  
✅ **API CRUD** — Create, read, update (prepared), delete operations  
✅ **Error handling** — 4xx/5xx, auth failures, invalid data, edge cases  
✅ **Schema validation** — Zod-based payload & response validation  
✅ **Response time** — Performance assertions at 2-3 second thresholds  
✅ **Data-driven tests** — Parameterized scenarios from external JSON  
✅ **Cross-browser** — Smoke tests on Chrome, Firefox, Safari  
✅ **Integration** — API-to-UI end-to-end workflows  
✅ **Logging & reporting** — Comprehensive artifacts and traces  

---

## What's NOT Yet Covered (Future Work)

### Tier 1 Priority (High Impact)
1. **UPDATE room endpoint** — Currently not exposed by demo API; test prepared but disabled
   - Add `roomApi.updateRoom(id, payload)` when endpoint available
   - Test PATCH /api/room/:id workflows

2. **Booking creation & management** — Focus on rooms; bookings partially covered
   - Add BookingApi fixture and tests
   - Test booking lifecycle (create, cancel, modify)

3. **Room images & media** — Currently mocked URLs; no actual upload testing
   - Test image upload, validation, CDN delivery
   - Test broken image handling (404 fallback)

4. **Advanced filtering & sorting** — Dashboard list functionality
   - Test room list sort (by price, name, accessibility)
   - Test advanced filters (room type, features, price range)

### Tier 2 Priority (Medium Impact)
5. **Accessibility (a11y) testing** — Currently manual
   - Add axe-core integration
   - Test keyboard navigation, screen reader labels
   - WCAG 2.1 AA compliance

6. **Performance profiling** — Beyond response times
   - Lighthouse scores
   - Core Web Vitals (LCP, FID, CLS)
   - Memory/CPU usage under load

7. **Load & stress testing** — Currently single-user only
   - Load testing with 50+ concurrent users
   - Identify bottlenecks, scaling limits
   - Test graceful degradation

8. **Visual regression** — Screenshots on every run, baseline comparison
   - Percy.io or similar integration
   - Detect unintended UI changes

### Tier 3 Priority (Nice to Have)
9. **Mobile responsiveness** — Currently desktop-only
   - Add iPhone 12, Android test devices
   - Test touch interactions, small viewport
   - Test responsive breakpoints

10. **i18n (Internationalization)** — Currently English only
    - Test multiple locales if app supports
    - RTL language handling

11. **Security testing** — Basic coverage only
    - OWASP Top 10 checks (XSS, CSRF, SQL injection)
    - Authentication bypass attempts
    - Authorization (role-based access)

12. **Database validation** — Currently API-only
    - Direct DB queries to verify data persistence
    - Transaction integrity tests
    - Constraint validation

---

## Top 3 Risks & Mitigations

### 🔴 Risk 1: Flaky Tests Due to Selector Changes
**Impact**: High (test failures, false negatives, reduced confidence)  
**Likelihood**: High (UI frameworks auto-generate IDs, selectors drift)  

**Mitigations**:
- ✅ Use semantic selectors (`getByRole`, `getByLabel`) instead of fragile XPath
- ✅ Prefer `data-testid` for critical elements (discussed with dev team)
- ✅ Page Object Model centralizes selectors — one update fixes all tests
- ✅ Quarterly selector review to catch drift early
- ✅ CI pipeline runs on every commit — fast feedback loop

**Monitoring**: Track flaky test metrics; if >5% of runs have failures, investigate selector strategy.

---

### 🔴 Risk 2: Brittle Authentication in Tests
**Impact**: High (blocks entire suite if auth breaks)  
**Likelihood**: Medium (auth logic changes, token expiry, session bugs)  

**Mitigations**:
- ✅ Separate auth setup (`auth.setup.ts`) from functional tests
- ✅ Store session state in `.auth/user.json` — reusable across browsers
- ✅ API fixture implements fresh token per test — no cross-test auth pollution
- ✅ Fallback login in test if session invalid
- ✅ Monitor auth response times; alert if > 5s

**Monitoring**: Track auth failure rates; if >10% of tests skip auth, investigate root cause.

---

### 🔴 Risk 3: Data Conflicts in Shared Test Environment
**Impact**: Medium (test interdependencies, race conditions)  
**Likelihood**: Medium (parallel test execution, shared demo data)  

**Mitigations**:
- ✅ Generate unique identifiers for test data (e.g., room names with timestamps)
- ✅ Tests are independent — no reliance on specific data state
- ✅ Integration test cleans up after itself (DELETE created rooms)
- ✅ Mock API responses where possible instead of hitting live API
- ✅ Consider separate test environment (staging) for parallel execution

**Monitoring**: Track data-related test failures (e.g., "room already exists"). If >3% of failures are data-related, implement cleanup jobs.

---

## Extending the Framework

### Adding a New UI Test

**Step 1**: Add locators to page object
```typescript
// pages/newPage.ts
export class NewPage extends BasePage {
  readonly element = this.page.getByTestId('element-id');
  
  async doSomething() {
    await this.clickElement(this.element, 'Element Name');
  }
}
```

**Step 2**: Add test
```typescript
// tests/ui/new.spec.ts
test('Should do something', async ({ page }) => {
  const newPage = new NewPage(page);
  await newPage.doSomething();
  // Assert
});
```

### Adding a New API Test

**Step 1**: Add method to API class
```typescript
// utils/newApi.ts
export class NewApi {
  async doSomething(payload) {
    return this.request.post('/api/endpoint', { data: payload });
  }
}
```

**Step 2**: Add fixture if needed
```typescript
// tests/fixtures/api.fixture.ts
const test = baseTest.extend<ApiFixtures>({
  newApi: async ({ authedContext }, use) => {
    await use(new NewApi(authedContext));
  },
});
```

**Step 3**: Add test
```typescript
// tests/api/new.spec.ts
test('Should do something', async ({ newApi }) => {
  const response = await newApi.doSomething(payload);
  assertStatus(response, 200, 'Do something');
  // Assert
});
```

### Adding New Test Data

```json
// test-data/newScenario.json
[
  {
    "scenario": "Scenario 1",
    "payload": { /* data */ },
    "expectedStatus": 200,
    "isValid": true
  }
]
```

Then load and parameterize in test:
```typescript
const scenarios = loadTestData('newScenario.json');
scenarios.forEach(({ scenario, payload, expectedStatus }) => {
  test(scenario, async ({ newApi }) => {
    const response = await newApi.create(payload);
    assertStatus(response, expectedStatus);
  });
});
```

---

## Conclusion

This framework provides a solid foundation for comprehensive, maintainable test coverage across UI, API, and integration layers. By following the patterns and principles outlined here, future engineers can confidently add tests, debug failures, and extend the framework without friction.

**Next Steps**:
1. Run the full test suite locally to validate setup
2. Review CI/CD pipeline for your environment
3. Customize `playwright.config.ts` for your deployment targets
4. Add team-specific test data and scenarios
5. Establish test maintenance cadence (weekly/monthly reviews)

---

## Quick Reference: Running Tests

```bash
# All tests
npx playwright test

# Specific suite
npx playwright test tests/ui/auth.spec.ts

# Specific browser
npx playwright test --project=firefox

# Debug mode
npx playwright test --debug

# Parallel (default)
npx playwright test --workers=4

# Serial (one at a time)
npx playwright test --workers=1

# Show results
npx playwright show-report
```

---

**Framework Built**: May 2026  
**Last Updated**: May 25, 2026  
**Maintainer**: QA Engineering Team  
**Questions?** Review architecture docs or check code comments for usage examples.

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