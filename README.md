# Restful Booker Admin Platform - Test Framework

> **Production-Grade Playwright + TypeScript Test Framework** for comprehensive UI, API, and Integration testing with Page Object Model, data-driven tests, and integrated reporting.

**Framework Version**: 1.0.0  
**Playwright Version**: 1.60.0+  
**Node.js Requirement**: 20.0.0+  
**Last Updated**: May 26, 2026  

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Design Decisions](#design-decisions)
- [Framework Architecture](#framework-architecture)
- [Local Setup & Installation](#local-setup--installation)
- [Environment Configuration](#environment-configuration)
- [Security Best Practices](#security-best-practices)
- [Running Tests](#running-tests)
- [Test Reports & Artifacts](#test-reports--artifacts)
- [CI/CD Pipeline](#cicd-pipeline)
- [What's Included](#whats-included)
- [Future Improvements](#future-improvements)

---

## 🎯 Overview

This framework demonstrates **SDET-2 quality engineering expertise** with:
- ✅ **39 production tests** across 3 layers (UI, API, Integration)
- ✅ **Page Object Model** with zero technical debt
- ✅ **Data-driven approach** with external JSON test data
- ✅ **Reusable utilities** (custom waits, assertions, logging)
- ✅ **GitHub Actions CI/CD** with parallel execution
- ✅ **Multi-layer reporting** (Playwright HTML + Allure)
- ✅ **Cross-browser support** (Chrome, Firefox, Safari)

---

## 🚀 Quick Start

Get the framework running in **5 minutes**:

```bash
# 1. Clone repository
git clone https://github.com/kundank2p/testmu-sdet2-kundan.git
cd testmu-sdet2-kundan

# 2. Install dependencies
npm ci
npx playwright install

# 3. Configure environment
cp .env.example .env
# Edit .env with your URLs and credentials

# 4. Run tests
npm test

# 5. View report
npx playwright show-report
```

**Expected Output**: 39 tests pass in ~2 minutes  
**Report Location**: `playwright-report/index.html`

---

## 🏛️ Design Decisions

### 1. **Playwright + TypeScript**
- **Why**: Native async/await, excellent TypeScript support, cross-browser, fast feedback
- **Trade-off**: Slightly heavier startup vs Cypress, but more reliable for enterprise
- **Alternative considered**: Selenium, Cypress (eliminated for lesser debugging/speed)

### 2. **Page Object Model (POM)**
- **Why**: Single point of selector maintenance, highly reusable test code, encapsulation
- **Implementation**: BasePage → LoginPage, DashboardPage inheritance
- **Benefit**: Tests are selector-agnostic, resilient to UI changes
- **Alternative considered**: Direct element access (faster initially, brittle long-term)

### 3. **Data-Driven Tests**
- **Why**: Scenarios externalized in JSON, easy to add new test cases without code changes
- **Implementation**: `test-data/` directory with user.json, rooms.json, invalidRooms.json
- **Benefit**: Clearer failure reporting ("Valid double room failed" vs "create test failed")
- **Alternative considered**: Hardcoded test data (simpler initially, maintenance nightmare)

### 4. **GitHub Actions CI/CD (Option A)**
- **Why**: Native GitHub integration, free tier sufficient, developer-friendly, immediate feedback
- **Chosen over**: Analytics dashboard (Option B) because immediate signal matters more than historical trends
- **Features**: Parallel execution (4 workers), cross-browser, multi-layer reporting, 7-day retention
- **Alternative considered**: Test analytics dashboard (better for later when baseline is stable)

### 5. **Zod Schema Validation**
- **Why**: Runtime type checking, fails fast on API contract changes, excellent TypeScript integration
- **Implementation**: Schemas in `schemas/` directory, applied to API responses
- **Benefit**: Catches breaking API changes before they impact UI
- **Alternative considered**: JSON Schema (less integrated with TypeScript ecosystem)

### 6. **Robust Selector Strategy**
- **Why**: Semantic locators resilient to styling changes, data-testid for programmatic identifiers
- **Implementation**: `getByLabel()`, `getByRole()`, `getByPlaceholder()`, `[data-testid]`
- **Benefit**: Tests survive UI refactors, no brittle XPath
- **Alternative considered**: CSS selectors, XPath (fragile, break on minor DOM changes)

---

## 🏗️ Framework Architecture

### Test Coverage (39 tests)

| Layer | Count | Purpose |
|-------|-------|---------|
| **UI Tests** | 8 | Form validation, navigation, element visibility |
| **API Tests** | 27 | CRUD operations, error handling, performance, schema validation |
| **Integration Tests** | 4 | End-to-end API-to-UI workflows, data persistence |

### Project Structure

```
testmu-sdet2-kundan/
├── README.md                    # ← You are here
├── test-strategy.md            # Test coverage, risks, improvements
├── ai-usage-log.md             # AI tool usage documentation
│
├── playwright.config.ts         # Test configuration
├── package.json                # Dependencies
├── .env.example                # Environment template
│
├── .github/workflows/
│   └── playwright-ci.yml       # GitHub Actions CI/CD pipeline
│
├── pages/                      # Page Object Model
│   ├── basePage.ts            # Base page with utilities
│   ├── loginPage.ts           # Login interactions
│   └── dashboardPage.ts       # Dashboard interactions
│
├── fixtures/                   # Custom test fixtures
│   ├── ui.fixture.ts          # UI test setup
│   └── api.fixture.ts         # API test setup
│
├── tests/
│   ├── ui/
│   │   ├── auth.spec.ts       # Login tests (1)
│   │   └── dashboard.spec.ts  # Dashboard tests (7)
│   ├── api/
│   │   ├── booking.spec.ts    # CRUD + performance tests (15)
│   │   └── errors.spec.ts     # Error handling tests (12)
│   └── integration/
│       └── e2e-room-lifecycle.spec.ts  # E2E tests (4)
│
├── test-data/
│   ├── user.json              # Login scenarios
│   ├── rooms.json             # Valid room payloads
│   └── invalidRooms.json      # Invalid room data
│
├── utils/
│   ├── logger.ts              # Structured logging
│   ├── waitUtils.ts           # Custom wait utilities
│   ├── apiClient.ts           # Reusable API client
│   └── customAssertions.ts    # Custom assertions
│
└── schemas/
    ├── room.schema.ts         # Zod schema for rooms
    └── booking.schema.ts      # Booking schema
```

---

## 📋 Local Setup & Installation

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| npm | 10+ | Included with Node.js |
| Git | 2.0+ | [git-scm.com](https://git-scm.com) |

### Step 1: Clone Repository

```bash
git clone https://github.com/kundank2p/testmu-sdet2-kundan.git
cd testmu-sdet2-kundan
```

### Step 2: Install Dependencies

```bash
npm ci  # Clean install (preferred for CI environments)
npx playwright install --with-deps
```

### Step 3: Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

**Required Variables** (see `.env.example` for template):
```env
UI_BASE_URL=https://automationintesting.online
API_BASE_URL=https://automationintesting.online
ADMIN_USER=<your_admin_username>
ADMIN_PASS=<your_admin_password>
```
> ⚠️ **Never commit `.env` file** — it's in `.gitignore`. Use `.env.example` for documentation.

### Step 4: Verify Setup

```bash
npx playwright --version
npm test -- --dry-run  # Validate test discovery
```

---

## 🧪 Running Tests

### All Tests
```bash
npm test
# Runs all 39 tests across all browsers (~2 minutes)
```

### By Layer
```bash
npx playwright test tests/api/           # API tests only
npx playwright test tests/ui/auth.spec.ts # Specific file
npx playwright test --project=chromium    # Chromium browser
npx playwright test --project=firefox     # Firefox browser
npx playwright test --project=webkit      # Safari browser
```

### Interactive Modes
```bash
npx playwright test --ui                  # UI mode (watch tests)
npx playwright test --debug               # Debug mode (inspect steps)
npx playwright test --headed              # Show browser window
```

### View Reports
```bash
npx playwright show-report                # Playwright HTML report
npx allure open allure-report             # Allure dashboard (CI)
```

---

## 📊 Test Reports & Artifacts

### Playwright Report
- Screenshots on failure
- Video recordings (failure only)
- Step-by-step trace
- Network waterfall
- Console logs
- **Location**: `playwright-report/index.html`

### Allure Report (CI Only)
- Test timeline
- Flaky test detection
- Performance metrics
- Historical trends
- **Generated in**: GitHub Actions artifacts

### Artifacts Storage
```
test-results/           # Raw test results
playwright-report/      # HTML report (always)
allure-results/         # Allure JSON (CI only)
allure-report/          # Allure HTML (CI only)
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**File**: `.github/workflows/playwright-ci.yml`

**Triggers**:
- Push to main branch
- Pull request to main
- Manual trigger (workflow_dispatch)

**Execution**:
```
Setup (1 min)
  ↓
Parallel Tests (8 min)
  • UI Tests (Chromium, Firefox, WebKit)
  • API Tests
  • Integration Tests
  ↓
Reports (2 min)
  • Allure Report generation
  • Playwright Report generation
  • Artifact upload
  ↓
Total: ~11 minutes
```

**Features**:
- ✅ 4 parallel workers for speed
- ✅ Cross-browser testing (3 browsers)
- ✅ Multi-layer reporting
- ✅ Secret management (ADMIN_USER, ADMIN_PASS)
- ✅ Retry logic (2 retries)
- ✅ Flaky test detection
- ✅ 7-day artifact retention

**Environment Secrets** (GitHub repo Settings → Secrets):
```
ADMIN_USER    → admin username
ADMIN_PASS    → admin password
```

**View Results**:
1. Go to GitHub Actions tab
2. Click workflow run
3. Download allure-report or playwright-report artifact

---

## ✅ What's Included

### Test Layers

**UI Tests (8 tests)**:
- Valid login flow with session persistence
- Dashboard rendering and room list visibility
- Create button accessibility
- Page navigation and URL validation
- Page title verification

**API Tests (27 tests)**:
- CRUD Operations (Create, Read, Update, Delete)
- Authentication & error handling
- 4xx/5xx response codes
- Schema validation (Zod)
- Response time assertions (<2s for LIST, <3s for CREATE)
- Data persistence verification
- Edge cases (empty fields, invalid types)

**Integration Tests (4 tests)**:
- Create room via API, verify in UI dashboard
- Fetch via API, verify UI count matches
- Invalid data handling across layers
- Performance SLA validation

### Utilities & Patterns

**Fixtures**:
- `ui.fixture.ts` — Logged-in user session
- `api.fixture.ts` — Authenticated API context

**Custom Utilities**:
- `waitUtils.ts` — Custom waits with logging
- `logger.ts` — Structured logging
- `customAssertions.ts` — API assertions
- `apiClient.ts` — Reusable HTTP client

**Page Objects**:
- `basePage.ts` — Common utilities (click, fill, wait, assert)
- `loginPage.ts` — Login-specific methods
- `dashboardPage.ts` — Dashboard interactions

**Data**:
- `user.json` — Valid/invalid login scenarios
- `rooms.json` — Valid room payloads (8 types)
- `invalidRooms.json` — Invalid data for error tests

---

## 🚀 Future Improvements

### High Priority
1. **Visual Regression Testing** — Screenshot comparison for UI changes
2. **Performance Baselines** — Track test duration trends, catch slowdowns
3. **Scheduled Nightly Runs** — CI cron job for overnight regression
4. **Slack Notifications** — Real-time failure alerts to team

### Medium Priority
5. **Test Analytics Dashboard** — Grafana/Metabase for historical trends
6. **Multi-Environment** — Run against staging/production, dev
7. **Load Testing** — Concurrent API requests, performance stress tests
8. **Accessibility Testing** — WCAG compliance, screen reader support

### Nice to Have
9. **AI-Powered Debugging** — Auto-generate fixes for common failures
10. **Allure TestOps Integration** — Centralized test management
11. **Custom Report Portal** — Branded test reporting
12. **Mobile Testing** — Playwright mobile emulation

---

## 📚 Documentation

**Related Files**:
- `test-strategy.md` — Test coverage approach, risk analysis, improvements
- `ai-usage-log.md` — AI tool usage for transparency

---

## 🤝 Contributing

To add new tests:

1. **Create page object** (if new page):
   ```typescript
   // pages/newPage.ts
   export class NewPage extends BasePage {
     readonly element = this.page.getByLabel('...');
     async interact() { ... }
   }
   ```

2. **Create test file**:
   ```typescript
   // tests/ui/new.spec.ts
   import { test } from '../../fixtures/ui.fixture.js';
   
   test.describe('New Feature', () => {
     test('scenario', async ({ newPage }) => {
       await newPage.open();
       // assertions...
     });
   });
   ```

3. **Use data-driven approach** for multiple scenarios in JSON

4. **Add custom assertions** to `utils/customAssertions.ts` for reuse

---

## ❓ FAQ

**Q: How do I run tests offline?**  
A: Tests require internet access to https://automationintesting.online. For offline testing, configure a local server in `.env`.

**Q: Why are tests failing locally but passing in CI?**  
A: Common causes:
- Different credentials (.env vs GitHub Secrets)
- Timing issues (local faster, timeouts too aggressive)
- Browser differences (Firefox/Safari behavior varies)

**Q: How do I debug a failing test?**  
A: Use `npx playwright test --debug` or `--ui` mode. Check `test-results/` directory for screenshots/videos.

**Q: Can I run tests in parallel?**  
A: Yes! Default is 1 worker locally, 4 in CI. Configure in `playwright.config.ts`.

---

## 📄 License

This framework is part of the TestMu SDET-2 Assessment. For evaluation purposes only.

**Expected Output**: ~108+ tests pass in 2-3 minutes  
**Report Location**: `playwright-report/index.html`

---

## 🏗️ Framework Architecture

### Project Structure

```
testmu-sdet2-kundan/
├── pages/                      # Page Object Model classes
│   ├── basePage.ts            # Base class with common utilities
│   ├── loginPage.ts           # Login form interactions
│   ├── dashboardPage.ts       # Admin dashboard interactions
│   └── adminPage.ts           # Composite page (login + dashboard)
│
├── tests/
│   ├── ui/                    # Browser-based UI tests
│   │   ├── auth.spec.ts       # Authentication/login tests
│   │   ├── dashboard.spec.ts  # Dashboard interaction tests
│   │   └── smoke.spec.ts      # Cross-browser smoke tests
│   ├── api/                   # API endpoint tests
│   │   ├── booking.spec.ts    # CRUD operations & performance
│   │   └── errors.spec.ts     # Error handling & edge cases
│   ├── integration/           # End-to-end API-to-UI flows
│   │   └── booking.integration.spec.ts
│   ├── fixtures/              # Playwright fixtures & setup
│   │   ├── ui.fixture.ts      # UI test fixtures (logged-in page)
│   │   └── api.fixture.ts     # API test fixtures (auth context)
│   ├── auth/                  # Authentication setup
│   │   └── auth.setup.ts      # Global login session (runs once)
│   └── data/                  # Reserved for test data generation
│
├── utils/                     # Shared utilities & helpers
│   ├── customAssertions.ts   # API response assertions
│   ├── uiAssertions.ts       # UI element assertions
│   ├── logger.ts             # Structured logging
│   ├── retry.ts              # Retry with backoff logic
│   ├── waitUtils.ts          # Custom wait conditions
│   ├── roomApi.ts            # Room API client
│   ├── apiClient.ts          # Generic HTTP client
│   └── testDataHelpers.ts    # Test data utilities
│
├── schemas/                   # Zod validation schemas
│   ├── room.schema.ts        # Room entity schema
│   └── booking.schema.ts     # Booking entity schema
│
├── config/                    # Configuration
│   └── env.ts                # Environment variables
│
├── test-data/                # Externalised test data (JSON)
│   ├── user.json             # Login scenarios
│   ├── rooms.json            # Valid room payloads
│   └── invalidRooms.json     # Invalid payloads
│
├── .github/workflows/        # CI/CD pipelines
│   ├── test.yml             # Main test workflow
│   ├── nightly.yml          # Nightly regression run
│   └── report.yml           # Allure report generation
│
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies & scripts
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── test-strategy.md          # Test strategy documentation
└── README.md                 # This file
```

### Design Patterns

**1. Page Object Model (POM)**
- Encapsulates UI selectors in page classes
- Provides high-level methods for test interactions
- Reduces test maintenance when UI changes

**2. Fixture-Based Setup**
- UI fixtures handle session authentication
- API fixtures handle token management
- Custom fixture providers for common tasks

**3. Data-Driven Testing**
- Test scenarios externalised in JSON files
- Parameterized tests iterate over multiple datasets
- Easy to add new scenarios without code changes

**4. Multi-Layer Testing**
- **UI Tests**: User workflows, form validation, navigation
- **API Tests**: CRUD operations, error handling, performance
- **Integration Tests**: End-to-end flows combining UI + API

---

## 💻 Local Setup & Installation

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org) |
| **npm** | 10+ | Included with Node.js |
| **Git** | 2.0+ | [git-scm.com](https://git-scm.com) |
| **VS Code** (optional) | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

**Check installed versions**:
```bash
node --version    # Should be v20.x.x or higher
npm --version     # Should be 10.x.x or higher
git --version     # Should be 2.x.x or higher
```

### Step 1: Clone the Repository

```bash
# Clone via HTTPS (recommended for most users)
git clone https://github.com/kundank2p/testmu-sdet2-kundan.git

# Or clone via SSH (if you have SSH keys configured)
git clone git@github.com:kundank2p/testmu-sdet2-kundan.git

# Navigate to project
cd testmu-sdet2-kundan
```

### Step 2: Install Dependencies

```bash
# Install npm packages from package.json
npm ci

# Note: Use 'npm ci' (clean install) instead of 'npm install'
# ci is preferred in CI environments and enforces exact versions
```

**What gets installed**:
- `@playwright/test` — Playwright testing framework
- `typescript` — TypeScript compiler
- `ts-node` — TypeScript runtime for Node
- `zod` — Schema validation library
- `@faker-js/faker` — Fake data generation
- `allure-playwright` — Allure reporting adapter
- `dotenv` — Environment variable loader

### Step 3: Install Playwright Browsers

```bash
# Download Chromium, Firefox, and WebKit browsers
npx playwright install

# Optional: Install system dependencies (Linux only)
npx playwright install-deps
```

**Expected Output**:
```
Downloading Chromium ...
Downloading Firefox ...
Downloading WebKit ...
```

**Note**: This downloads ~400-500 MB of browser binaries. Allow 5-10 minutes.

### Step 4: Verify Installation

```bash
# Check Playwright version
npx playwright --version

# Run a simple test to verify setup
npx playwright test tests/ui/smoke.spec.ts --dry-run
```

---

## 🔐 Environment Configuration

### Step 1: Create Environment File

```bash
# Copy template to create .env file
cp .env.example .env
```

### Step 2: Configure Variables

Edit `.env` and fill in your environment values:

```env
# UI Base URL — where the web app is hosted
UI_BASE_URL=https://automationintesting.online

# API Base URL — where the API is hosted
# (can be same as UI_BASE_URL if API is on same domain)
API_BASE_URL=https://automationintesting.online

# Admin credentials for login tests
# For test environment, use test user credentials
# For CI/CD, use GitHub Secrets (see .github/workflows/playwright-ci.yml)
ADMIN_USER=<your_test_username>
ADMIN_PASS=<your_test_password>

# Optional: Playwright config overrides
TEST_TIMEOUT=30000          # Test timeout in milliseconds (default: 30s)
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=false
```

### Step 3: Verify Configuration

```bash
# Check if .env is loaded correctly
node -e "require('dotenv').config(); console.log('UI_BASE_URL:', process.env.UI_BASE_URL);"
```

**Expected**: Should print your configured URL.

---

## 🔒 Security Best Practices

### Credential Management
- ✅ **Never** commit `.env` file — it's in `.gitignore`
- ✅ Use `.env.example` as template (placeholder values only)
- ✅ Store actual credentials in `.env` (local) or GitHub Secrets (CI/CD)
- ✅ Rotate credentials periodically, especially if accidentally exposed

### GitHub Secrets Setup
1. Go to repo **Settings → Secrets and Variables → Actions**
2. Add secrets (GitHub auto-masks them in logs):
   - `ADMIN_USER` = test username
   - `ADMIN_PASS` = test password
   - `UI_BASE_URL` = test URL
   - `API_BASE_URL` = test API URL
3. Workflow automatically uses: `${{ secrets.ADMIN_USER }}`

### Git History Protection
- `.env` is gitignored, never committed ✅
- `.auth/` directory (session tokens) is gitignored ✅
- If credentials ever committed:
  ```bash
  git-filter-repo --invert-paths --path .env  # Remove from history
  git push --force-with-lease
  ```

### Safe Logging
- ✅ Framework logs endpoint names only (no payloads)
- ✅ Credentials never passed to logger
- ✅ GitHub automatically masks `${{ secrets.* }}` in workflow logs
- ✅ Test reports don't contain credentials or tokens

### CI/CD Security
- Secrets in GitHub Actions are auto-masked in logs
- Use separate credentials for CI/CD vs local testing
- Validate `.env.example` is committed, `.env` is not
- Review Allure reports don't leak sensitive data (they don't)

---

## 🧪 Running Tests

### Running All Tests

```bash
# Run all tests (UI, API, Integration)
npx playwright test

# Expected: 108+ tests pass in 2-3 minutes
```

### Running by Test Layer

```bash
# Run only API tests
npx playwright test --project=api

# Run only UI tests (Chromium)
npx playwright test --project=chromium

# Run only Firefox tests
npx playwright test --project=firefox

# Run only Safari/WebKit tests
npx playwright test --project=webkit

# Run only UI + Integration (skip API)
npx playwright test --project=chromium --project=firefox --project=webkit
```

### Running Specific Test Files

```bash
# Run authentication tests only
npx playwright test tests/ui/auth.spec.ts

# Run dashboard tests only
npx playwright test tests/ui/dashboard.spec.ts

# Run API CRUD tests only
npx playwright test tests/api/booking.spec.ts

# Run API error handling tests only
npx playwright test tests/api/errors.spec.ts

# Run integration tests only
npx playwright test tests/integration/booking.integration.spec.ts
```

### Running Specific Test Cases

```bash
# Run tests matching a pattern
npx playwright test -g "login"

# Run tests matching pattern in specific file
npx playwright test tests/ui/auth.spec.ts -g "valid login"

# Run with regex pattern
npx playwright test -g "login|dashboard"
```

### Running with Different Options

```bash
# Run with headed browser (see the browser UI)
npx playwright test --headed

# Run in debug mode (interactive step-through)
npx playwright test --debug

# Run with trace viewer (for debugging failed tests)
npx playwright test --trace on

# Run in serial mode (one test at a time, slower but deterministic)
npx playwright test --workers=1

# Run with custom worker count
npx playwright test --workers=2

# Show browser while running
npx playwright test --headed --workers=1

# Repeat each test N times (useful for flaky test detection)
npx playwright test tests/ui/auth.spec.ts --repeat-each=3

# Stop after first failure
npx playwright test --x

# Show test output during run
npx playwright test --reporter=list
```

### Running Tests with Different Timeouts

```bash
# Increase test timeout to 60 seconds (for slow networks)
TEST_TIMEOUT=60000 npx playwright test

# Increase expect timeout to 10 seconds
npx playwright test tests/ui/auth.spec.ts

# Note: Global timeout set in playwright.config.ts, overridable per test
```

---

## 📊 Test Reports & Artifacts

### Playwright HTML Report

After tests complete, an interactive HTML report is generated:

```bash
# View the latest report
npx playwright show-report

# Or open manually
open playwright-report/index.html  # macOS
start playwright-report/index.html  # Windows
xdg-open playwright-report/index.html # Linux
```

**Report Includes**:
- ✅ Test timeline and duration
- 📸 Screenshots of failures
- 🎥 Video recordings (on-failure mode)
- 📋 Full browser traces for debugging
- 📈 Test history and trends

### Accessing Test Artifacts

```
test-results/
├── ui-dashboard-.../ 
│   ├── error-context.md  # Failure context
│   ├── screenshot.png    # Failed state screenshot
│   ├── video.webm       # Test video recording
│   └── trace.zip        # Full Playwright trace
├── api-create-room.../
│   └── trace.zip
└── ...
```

### Allure Reports (CI/CD Only)

In CI environments, Allure reports are generated:

```bash
# Generate Allure report from results
allure generate allure-results -o allure-report

# Open Allure report
allure open allure-report
```

**Allure Features**:
- Trend analysis (pass/fail rates over time)
- Test history and duration trends
- Defect tracking integration
- Environment information

---

## 🔄 CI/CD Integration

### Overview

Tests that nobody runs aren't tests. This framework includes a **production-grade GitHub Actions CI/CD pipeline** that runs on every push and PR, providing immediate feedback on code quality.

**Read the full CI/CD strategy and setup guide**: [`docs/CI_CD_STRATEGY.md`](./docs/CI_CD_STRATEGY.md)

### GitHub Actions Pipeline (Option A - Recommended)

#### Step 1: Enable GitHub Actions

```bash
# Create workflows directory (if not exists)
mkdir -p .github/workflows
```

#### Step 2: Create Main Test Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    # Run nightly at 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    timeout-minutes: 30

    strategy:
      fail-fast: false
      matrix:
        node-version: [20.x]
        test-project:
          - api
          - chromium
          - firefox
          - webkit

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run tests - ${{ matrix.test-project }}
        run: npx playwright test --project=${{ matrix.test-project }}
        env:
          CI: true
          UI_BASE_URL: ${{ secrets.UI_BASE_URL }}
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          ADMIN_USER: ${{ secrets.ADMIN_USER }}
          ADMIN_PASS: ${{ secrets.ADMIN_PASS }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.test-project }}
          path: playwright-report/
          retention-days: 30

      - name: Upload Allure results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-results-${{ matrix.test-project }}
          path: allure-results/
          retention-days: 30

      - name: Publish test summary
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.test-project }}
          path: test-results/
          retention-days: 30

  report:
    name: Generate Allure Report
    needs: test
    runs-on: ubuntu-latest
    if: always()

    steps:
      - name: Download Allure results
        uses: actions/download-artifact@v4
        with:
          path: allure-download

      - name: Merge Allure results
        run: |
          mkdir -p allure-results
          find allure-download -name '*.json' -exec cp {} allure-results/ \;

      - name: Generate Allure Report
        uses: simple-elf/allure-report-action@master
        if: always()
        with:
          allure_results: allure-results
          allure_history: allure-history
          keep_reports: 20

      - name: Deploy report to GitHub Pages
        if: always()
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: allure-report
```

#### Step 3: Configure Secrets

Go to **Settings → Secrets and Variables → Actions** and add:

```
UI_BASE_URL       = https://automationintesting.online
API_BASE_URL      = https://automationintesting.online
ADMIN_USER        = <your_admin_username>
ADMIN_PASS        = <your_admin_password>
```

> ⚠️ **Security Note**: Never commit actual credentials. GitHub automatically masks secrets in workflow logs when using `${{ secrets.* }}` syntax.

#### Step 4: Verify Workflow

1. Push a commit: `git push`
2. Go to **Actions** tab on GitHub
3. Watch test run in real-time
4. After completion, download reports from Artifacts

---

### GitLab CI

Create `.gitlab-ci.yml` in project root:

```yaml
stages:
  - test
  - report

variables:
  NODE_VERSION: '20'
  UI_BASE_URL: 'https://automationintesting.online'
  API_BASE_URL: 'https://automationintesting.online'

before_script:
  - node --version
  - npm --version
  - npm ci
  - npx playwright install --with-deps

test_api:
  stage: test
  image: mcr.microsoft.com/playwright:v1.60.0-focal
  script:
    - npx playwright test --project=api --reporter=html
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    reports:
      junit: test-results/junit.xml
    expire_in: 30 days

test_ui_chrome:
  stage: test
  image: mcr.microsoft.com/playwright:v1.60.0-focal
  script:
    - npx playwright test --project=chromium --reporter=html
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 30 days

test_ui_firefox:
  stage: test
  image: mcr.microsoft.com/playwright:v1.60.0-focal
  script:
    - npx playwright test --project=firefox --reporter=html
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 30 days

test_ui_webkit:
  stage: test
  image: mcr.microsoft.com/playwright:v1.60.0-focal
  script:
    - npx playwright test --project=webkit --reporter=html
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 30 days

generate_report:
  stage: report
  image: mcr.microsoft.com/playwright:v1.60.0-focal
  script:
    - npm install -g allure-commandline
    - allure generate allure-results -o allure-report
  artifacts:
    paths:
      - allure-report/
    expire_in: 90 days
  allow_failure: true
```

---

### Jenkins Pipeline

Create `Jenkinsfile` in project root:

```groovy
pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        UI_BASE_URL = credentials('ui_base_url')
        API_BASE_URL = credentials('api_base_url')
        ADMIN_USER = credentials('admin_user')
        ADMIN_PASS = credentials('admin_pass')
        CI = 'true'
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Lint') {
            steps {
                sh 'npx tsc --noEmit'
            }
        }

        stage('Test - API') {
            steps {
                sh 'npx playwright test --project=api --reporter=html'
            }
        }

        stage('Test - UI') {
            parallel {
                stage('Chromium') {
                    steps {
                        sh 'npx playwright test --project=chromium'
                    }
                }
                stage('Firefox') {
                    steps {
                        sh 'npx playwright test --project=firefox'
                    }
                }
                stage('WebKit') {
                    steps {
                        sh 'npx playwright test --project=webkit'
                    }
                }
            }
        }

        stage('Report') {
            when {
                always()
            }
            steps {
                script {
                    sh 'allure generate allure-results -o allure-report'
                }
                publishHTML([
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report',
                    keepAll: true
                ])
                publishHTML([
                    reportDir: 'allure-report',
                    reportFiles: 'index.html',
                    reportName: 'Allure Report',
                    keepAll: true
                ])
            }
        }
    }

    post {
        always {
            junit testResults: 'test-results/**/*.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'test-results/**, playwright-report/**', allowEmptyArchive: true
            cleanWs()
        }
        failure {
            emailext(
                subject: "Test Pipeline Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Check console output at ${env.BUILD_URL} to view the results.",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
```

---

## ➕ Adding New Tests

### Adding a UI Test

**1. Update Page Object** (`pages/newPage.ts`):

```typescript
import type { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage.js';

export class NewPage extends BasePage {
  // Define selectors using semantic locators
  readonly element = this.page.getByTestId('element-id');
  readonly button = this.page.getByRole('button', { name: /button label/i });

  constructor(page: Page) {
    super(page);
  }

  // Business logic methods
  async doSomething() {
    await this.clickElement(this.button, 'Button');
  }
}
```

**2. Add Test** (`tests/ui/newFeature.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';
import { NewPage } from '../../pages/newPage.js';

test.describe('New Feature Tests', () => {
  test('Should do something', async ({ page }) => {
    const newPage = new NewPage(page);
    await newPage.doSomething();
    await expect(newPage.element).toBeVisible();
  });
});
```

### Adding an API Test

**1. Create API Client** (`utils/newApi.ts`):

```typescript
import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './logger.js';

export class NewApi {
  constructor(private request: APIRequestContext) {}

  async doSomething(payload: object): Promise<APIResponse> {
    logger.info('Doing something via API');
    return this.request.post('/api/endpoint', { data: payload });
  }
}
```

**2. Add Test** (`tests/api/newFeature.spec.ts`):

```typescript
import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture.js';
import { assertStatus } from '../../utils/customAssertions.js';

test('API should do something', async ({ authedContext }) => {
  const api = new NewApi(authedContext);
  const response = await api.doSomething({ key: 'value' });
  assertStatus(response, 200, 'Do something');
});
```

### Adding Data-Driven Tests

**1. Create Test Data** (`test-data/newScenario.json`):

```json
[
  {
    "scenario": "Scenario 1",
    "payload": { "key": "value1" },
    "expectedStatus": 200
  },
  {
    "scenario": "Scenario 2",
    "payload": { "key": "value2" },
    "expectedStatus": 200
  }
]
```

**2. Parameterize Test**:

```typescript
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const scenarios = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../../test-data/newScenario.json'),
    'utf-8'
  )
);

scenarios.forEach(({ scenario, payload, expectedStatus }) => {
  test(`Scenario: ${scenario}`, async ({ api }) => {
    const response = await api.doSomething(payload);
    assertStatus(response, expectedStatus);
  });
});
```

---

## 🐛 Debugging & Troubleshooting

### Common Issues

#### Issue 1: Tests Hang or Timeout

```bash
# Increase timeout temporarily
TEST_TIMEOUT=60000 npx playwright test

# Run single test to isolate issue
npx playwright test tests/ui/auth.spec.ts

# Run in debug mode to see what's happening
npx playwright test --debug
```

**Solutions**:
- Check network connectivity
- Verify `UI_BASE_URL` and `API_BASE_URL` are correct
- Look at browser output in debug mode
- Check server/application logs

#### Issue 2: "Page not found" or 404 Errors

```bash
# Verify environment variables
cat .env | grep URL

# Manually test URL
curl $UI_BASE_URL

# Check if server is running
ping automationintesting.online
```

**Solutions**:
- Verify `.env` file has correct URLs
- Check that test server is running
- Verify firewall isn't blocking access
- Check DNS resolution: `nslookup automationintesting.online`

#### Issue 3: Authentication Failures

```bash
# Re-authenticate and regenerate session
rm .auth/user.json

# Re-run tests (will regenerate session)
npx playwright test tests/ui/auth.spec.ts
```

**Solutions**:
- Verify `ADMIN_USER` and `ADMIN_PASS` in `.env`
- Check if credentials are still valid
- Look at `auth.spec.ts` to understand login flow
- Check for expired sessions or cookies

#### Issue 4: Flaky Tests

```bash
# Repeat test multiple times to identify flakiness
npx playwright test tests/ui/auth.spec.ts --repeat-each=5

# Run with trace for failure analysis
npx playwright test --trace on

# Debug in headed mode
npx playwright test --headed --debug
```

**Solutions**:
- Increase wait timeouts in page objects
- Use `waitForPageSettle()` instead of `waitForLoadState('networkidle')`
- Verify selectors are stable (not auto-generated IDs)
- Check server performance/latency

### Debugging Tools

#### 1. Playwright Inspector

```bash
# Launch interactive debugger
npx playwright test --debug

# Step through test, inspect DOM, run JavaScript in console
```

#### 2. VS Code Debugger

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Playwright Tests",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["playwright", "test", "--debug"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

#### 3. Trace Viewer

```bash
# Generate traces
npx playwright test --trace on

# View trace
npx playwright show-trace test-results/trace.zip
```

#### 4. Browser DevTools

```bash
# Run with headed mode to access DevTools
npx playwright test --headed

# Inspect elements and check console
```

### Viewing Logs

```bash
# Logs are in test report
npx playwright show-report

# Or check console output
npx playwright test --reporter=list | grep -i error
```

---

## ✅ Best Practices

### 1. Writing Maintainable Tests

```typescript
// ❌ BAD: Hard-coded selectors, no abstraction
test('Login', async ({ page }) => {
  await page.locator('xpath=//*[@id="username"]').fill('admin');
  await page.locator('xpath=//*[@id="password"]').fill('pass');
  await page.locator('xpath=//*[@id="button_1234"]').click();
});

// ✅ GOOD: Use page objects, semantic selectors, clear intentions
test('Login succeeds with valid credentials', async ({ loginPage }) => {
  await loginPage.login('admin', 'password');
  await loginPage.assertLoginSuccess();
});
```

### 2. Data-Driven Over Hard-Coded Data

```typescript
// ❌ BAD: Multiple similar tests
test('Create room type 1', async ({ roomApi }) => { /* ... */ });
test('Create room type 2', async ({ roomApi }) => { /* ... */ });
test('Create room type 3', async ({ roomApi }) => { /* ... */ });

// ✅ GOOD: Single parameterized test
rooms.forEach(({ type, payload }) => {
  test(`Create room: ${type}`, async ({ roomApi }) => {
    const response = await roomApi.createRoom(payload);
    assertStatus(response, 200);
  });
});
```

### 3. Clear Test Names

```typescript
// ❌ BAD: Vague names
test('Test 1', () => { });
test('Login works', () => { });

// ✅ GOOD: Descriptive, actionable names
test('Valid credentials log user in and redirect to dashboard', () => { });
test('Invalid password displays form with error message', () => { });
```

### 4. One Assertion Per Test (or Logical Group)

```typescript
// ❌ BAD: Test multiple unrelated things
test('Create room and verify', async ({ roomApi }) => {
  const res1 = await roomApi.createRoom(payload1);
  expect(res1.ok()).toBe(true);
  const res2 = await roomApi.createRoom(payload2);
  expect(res2.ok()).toBe(true);
  const res3 = await roomApi.listRooms();
  expect(res3.ok()).toBe(true);
});

// ✅ GOOD: Each test focuses on one thing
test('Create room returns 200', async ({ roomApi }) => {
  const response = await roomApi.createRoom(payload);
  assertStatus(response, 200);
});

test('Created room appears in list', async ({ roomApi }) => {
  // Create, then verify in list
});
```

### 5. Use Fixtures for Setup

```typescript
// ❌ BAD: Repeated setup in every test
test('Dashboard shows rooms', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndWait('admin', 'password');
  await page.goto('/admin');
  const dashboard = new DashboardPage(page);
  // ...
});

// ✅ GOOD: Use fixtures for automatic setup
test('Dashboard shows rooms', async ({ dashboardPage }) => {
  await dashboardPage.assertRoomListVisible();
});
```

### 6. Leverage Custom Assertions

```typescript
// ❌ BAD: Raw Playwright assertions
expect(response.status()).toBe(200);

// ✅ GOOD: Domain-specific assertions with context
assertStatus(response, 200, 'Create room');
```

---

## ❓ FAQ

### Q: How do I run tests on my local machine first before pushing to CI?

```bash
# Run locally to catch issues early
npx playwright test --headed

# Fix any issues, then push
git add .
git commit -m "Add new test feature"
git push origin feature-branch
```

### Q: Can I run tests against a different environment (staging, production)?

```bash
# Override environment variables
UI_BASE_URL=https://staging.example.com API_BASE_URL=https://staging-api.example.com npx playwright test
```

Or create multiple `.env` files:

```bash
cp .env .env.staging
# Edit .env.staging with staging URLs
source .env.staging
npx playwright test
```

### Q: How do I skip a test temporarily?

```typescript
// Skip a single test
test.skip('Future feature', async () => { });

// Skip on specific browser
test.skip(browserName === 'webkit', 'Not yet supported on Safari');

// Skip if environment variable is set
test.skip(process.env.SKIP_SLOW_TESTS, 'Slow test');
```

### Q: How do I only run tests that failed last time?

```bash
npx playwright test --last-failed
```

### Q: How do I parallelize tests for speed?

Tests run in parallel by default (4 workers):

```bash
# Increase parallelization
npx playwright test --workers=8

# Run serially (useful for debugging)
npx playwright test --workers=1
```

### Q: How do I view failing test details?

```bash
# After test failure, open report
npx playwright show-report

# Or check trace file
npx playwright show-trace test-results/trace.zip

# Or check error logs
cat test-results/*/error-context.md
```

### Q: How do I add a new page to test against?

1. Create page object: `pages/newPage.ts`
2. Add to fixture: `tests/fixtures/ui.fixture.ts`
3. Use in test: `async ({ newPage }) => { }`

See **Adding New Tests** section above for details.

### Q: How do I mock API responses?

```typescript
// Intercept and mock API responses
await page.route('/api/room', route => {
  route.abort('blockedbyclient');
});

await page.route('/api/room', route => {
  route.continue({ response: new Response(JSON.stringify({ ... })) });
});
```

### Q: Where are test artifacts stored?

```
playwright-report/     # HTML report (view with 'npx playwright show-report')
test-results/          # Raw test results (artifacts, videos, traces)
allure-results/        # Allure report data (CI only)
.auth/                 # Session storage (don't commit to git)
```

### Q: How do I debug a failed test in CI?

1. Download test artifacts from CI job
2. Open `playwright-report/index.html`
3. Click on failed test
4. View screenshot, video, and trace
5. Run locally with same conditions to reproduce

---

## 📞 Support & Contributions

**Issues & Bugs**: [GitHub Issues](https://github.com/kundank2p/testmu-sdet2-kundan/issues)  
**Documentation**: See `test-strategy.md` for detailed testing patterns  
**Framework Maintainer**: QA Engineering Team

---

## 📝 License

This project is licensed under the ISC License.

---

## 🎯 Next Steps

1. ✅ Follow **Quick Start** above to get running
2. ✅ Review **test-strategy.md** for testing philosophy
3. ✅ Read **Architecture Overview** to understand project structure
4. ✅ Try running tests locally: `npx playwright test --headed`
5. ✅ Add your first test using **Adding New Tests** guide
6. ✅ Set up CI/CD pipeline using **CI/CD Integration** section

**Happy Testing! 🚀**
