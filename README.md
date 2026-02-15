# Claims API – Playwright API Test Suite

A **TypeScript + Playwright API test suite** for a mock **Claims API**, simulating an insurance claims system. Demonstrates advanced QA automation practices, including reusable clients, negative testing, filtering, and CI/CD integration.

---

## 🚀 Quick Start (5 minutes)

### Step 1: Clone & Install
```bash
git clone https://github.com/omfasom/claims-api-project.git
cd claims-api-project
npm ci
```

### Step 2: Install Browsers (One-time)
```bash
npx playwright install chromium --with-deps
```

### Step 3: Run Tests
```bash
npm test
```

✅ **Done!** All 12 tests will run automatically.

---

## 📖 Common Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests (recommended) |
| `npm run test:headed` | Run with more verbose output (API tests, no UI) |
| `npm run test:debug` | Debug mode with inspector |
| `npm run mock` | Start mock server only |
| `npx playwright show-report` | View test results |
| `npx playwright test --reporter=list` | Simple list output for API tests |
---

## 📋 Project Overview

The Claims API manages insurance claims with the following attributes:

- `id` – unique identifier
- `policyNumber` – insurance policy reference
- `claimantName` – claimant information
- `damageDate` – date of incident
- `lossDescription` – description of damage
- `status` – lifecycle status (`OPEN`, `IN_REVIEW`, `APPROVED`, `PAID`, `REJECTED`)
- `payoutAmount` – approved payout (if any)
- `payoutDate` – date of payout (if any)

The test suite covers:
- ✅ **Happy path** – full lifecycle of a claim
- ✅ **Negative / validation tests** – missing fields, invalid transitions, not found errors
- ✅ **List / filter tests** – filter by status, policy number, claimant name, and pagination

---

## 📁 Project Structure

```
claims-api-project/
├── openapi/
│   └── claims-api.json              # OpenAPI specification
├── mock-server/
│   └── server.ts                    # Express mock API server
├── tests/
│   ├── api/
│   │   ├── claims.spec.ts           # Happy path tests
│   │   ├── negative.spec.ts         # Validation / error tests
│   │   └── filter.spec.ts           # List / filter tests
│   └── utils/
│       ├── apiClient.ts             # Reusable HTTP client
│       └── schemaValidator.ts       # JSON schema validation
├── .github/
│   └── workflows/tests.yml          # GitHub Actions CI/CD
├── QUICKSTART.md                    # Detailed step-by-step guide
├── README.md                        # This file
└── package.json                     # Dependencies
```

---

## 🔌 API Endpoints

### POST /claims
Create a new claim. Requires: `policyNumber`, `claimantName`, `damageDate`, `lossDescription`

```bash
curl -X POST http://localhost:3000/claims \
  -H "Content-Type: application/json" \
  -d '{"policyNumber":"POL-2024-08567","claimantName":"Omer Somuncu","damageDate":"2024-02-14","lossDescription":"Water damage"}'
```

### GET /claims
List all claims with optional filtering

```bash
curl http://localhost:3000/claims
curl "http://localhost:3000/claims?status=OPEN"
curl "http://localhost:3000/claims?policyNumber=POL-2024-08567"
curl "http://localhost:3000/claims?claimantName=Omer"
```

### GET /claims/:id
Retrieve a specific claim

```bash
curl http://localhost:3000/claims/CLM-1707918000000
```

### PATCH /claims/:id
Update a claim's status and/or payout

```bash
curl -X PATCH http://localhost:3000/claims/CLM-1707918000000 \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_REVIEW"}'
```

### POST /reset
Reset all claims data (testing utility)

```bash
curl -X POST http://localhost:3000/reset
```

---

## ✅ Test Results

**Status: All 12 Tests Passing ✓**

| Category | Tests | Status |
|----------|-------|--------|
| Happy Path | 4 | ✅ Passing |
| Filtering & List | 4 | ✅ Passing |
| Negative/Validation | 4 | ✅ Passing |
| **Total** | **12** | **✅ Passing** |

### Test Breakdown

**Happy Path Tests**
- ✓ Create claim (Omer Somuncu)
- ✓ Retrieve claim
- ✓ Update status through lifecycle
- ✓ List claims

**Filter Tests**
- ✓ Filter by status
- ✓ Filter by policy number (Fatih Aydogan)
- ✓ Filter by claimant name partial match (Burak Ozdemir)
- ✓ Pagination metadata

**Negative/Validation Tests**
- ✓ Missing required field (Ozan Dursun)
- ✓ Invalid status transition (Ayse Yilmaz)
- ✓ Claim not found error
- ✓ Missing payout amount (Mehmet Kaya)

---

## 🏗️ Architecture & Design

### ApiClient (`tests/utils/apiClient.ts`)
- Generic HTTP client wrapping Playwright's `APIRequestContext`
- Supports POST, GET, PATCH methods
- Type-safe with optional response typing
- Exported `ApiError` interface for error response types

### Mock Server (`mock-server/server.ts`)
- Express.js server simulating a full claims API
- In-memory data store (cleared on reset)
- Validates required fields
- Enforces state transitions
- Provides filtering and pagination

### Best Practices
- ✅ **Isolated tests** – Each test gets its own `request` fixture
- ✅ **Data isolation** – Tests call `POST /reset` before seeding data
- ✅ **Type safety** – TypeScript with Playwright test typing
- ✅ **Reusable client** – Single `ApiClient` class reduces boilerplate
- ✅ **Clear reporting** – HTML reports with detailed failure info
- ✅ **CI/CD ready** – GitHub Actions workflow included

---

## 🔧 Advanced Usage

### Important: API Tests (Not UI Tests)
These are **API tests**, not UI/E2E tests. They don't interact with browser UI elements. The `--headed` flag doesn't show a visual browser window because there's no UI to display - the tests make HTTP requests directly to the API.

For better visibility into API test execution, use the `--reporter=list` flag instead:
```bash
npx playwright test --reporter=list
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```
Launches Playwright Inspector to step through tests.

### Run Tests with Visible Browser
```bash
npm run test:headed
```

### Run Against Different Environments
```bash
# Staging
API_BASE_URL=https://api.staging.example.com npm test

# Production
API_BASE_URL=https://api.example.com npm test
```

### Manual Server + Tests (separate terminals)
**Terminal 1:**
```bash
npm run mock
```

**Terminal 2:**
```bash
npx playwright test
```

### View Test Report
```bash
npx playwright show-report
```

---

## 🚨 Troubleshooting

### Tests hang or timeout
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill the process (replace XXXX with PID)
kill -9 XXXX

# Run tests again
npm test
```

### Browser installation fails
```bash
npx playwright install --with-deps
npm test
```

### See detailed test output
```bash
npx playwright test --reporter=list
```

### Clear cached reports
```bash
rm -rf playwright-report/
npm test
```

---

## 📚 For More Details

See **[QUICKSTART.md](./QUICKSTART.md)** for detailed step-by-step instructions with screenshots.

---

## 🤝 Contributing

To add more tests:

1. Create a new test file in `tests/api/`
2. Use the `ApiClient` for HTTP requests
3. Each test should receive `{ request }` fixture
4. Call `client.post("/reset", {})` to reset data between tests if needed

Example:
```typescript
test("My test", async ({ request }) => {
    const client = new ApiClient(request);
    const result = await client.post("/claims", { /* data */ });
    expect(result).toBeDefined();
});
```

---

## 📄 License

ISC






