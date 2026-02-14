# Claims API – Playwright API Test Suite

This repository contains a **TypeScript + Playwright API test suite** for a mock **Claims API**, simulating an insurance claims system. It demonstrates advanced QA automation practices, including reusable clients, JSON schema validation, negative and edge-case testing, filtering, and CI/CD integration.

---

## **Project Overview**

The Claims API allows managing insurance claims, including creating, retrieving, updating, and filtering claims. Each claim has:

- `id` – unique identifier
- `policyNumber` – insurance policy reference
- `claimantName` – claimant information
- `damageDate` – date of incident
- `lossDescription` – description of damage
- `status` – lifecycle status (`OPEN`, `IN_REVIEW`, `APPROVED`, `PAID`, `REJECTED`)
- `payoutAmount` – approved payout (if any)
- `payoutDate` – date of payout (if any)

The test suite is structured to cover:

- **Happy path** – full lifecycle of a claim
- **Negative / validation tests** – missing fields, invalid status transitions, not found errors
- **List / filter tests** – filter by status, policy number, claimant name, and pagination

---

## **Project Structure**

claims-api-project/
├── openapi/
│   └── claims-api.json           # OpenAPI specification
├── mock-server/
│   └── server.ts                 # Local mock API server
├── tests/
│   ├── api/
│   │   ├── claims.spec.ts        # Happy path tests
│   │   ├── negative.spec.ts      # Validation / error tests
│   │   └── filter.spec.ts        # List / filter tests
│   └── utils/
│       ├── apiClient.ts          # Reusable API client
│       └── schemaValidator.ts    # JSON schema validation helper
├── .github/
│   └── workflows/
│       └── tests.yml             # CI workflow for GitHub Actions
└── README.md                     # Project README

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/omfasom/claims-api-project.git
cd claims-api-project

# Install dependencies
npm ci

# Install Playwright browsers (one-time setup)
npx playwright install chromium --with-deps
```

### Run Tests Locally

The test suite automatically starts the mock server, waits for it to be ready, runs tests, and cleans up:

```bash
npm test
```

**Alternative ways to run tests:**

```bash
# Run in debug mode (step through tests in Playwright Inspector)
npm run test:debug

# Run with visible browser window
npm run test:headed

# Run mock server manually (for development)
npm run mock
```

### View Test Results

After tests complete, view the HTML report:

```bash
npx playwright show-report
```

### Run Tests Against Different Environments

```bash
# Against local mock server (default)
npm test

# Against staging
API_BASE_URL=https://api.staging.example.com npx playwright test

# Against production
API_BASE_URL=https://api.example.com npx playwright test
```

---

## API Endpoints

The mock Claims API provides the following endpoints:

### POST /claims
Create a new claim. Requires: `policyNumber`, `claimantName`, `damageDate`, `lossDescription`

```bash
curl -X POST http://localhost:3000/claims \
  -H "Content-Type: application/json" \
  -d '{"policyNumber":"POL-2024-00123","claimantName":"John Doe","damageDate":"2024-02-14","lossDescription":"Water damage"}'
```

### GET /claims
List all claims with optional filtering and pagination

```bash
# Get all claims
curl http://localhost:3000/claims

# Filter by status
curl "http://localhost:3000/claims?status=OPEN"

# Filter by policy number
curl "http://localhost:3000/claims?policyNumber=POL-2024-00123"

# Filter by claimant name (partial match)
curl "http://localhost:3000/claims?claimantName=John"
```

### GET /claims/:id
Retrieve a specific claim by ID

```bash
curl http://localhost:3000/claims/CLM-1707918000000
```

### PATCH /claims/:id
Update a claim's status and/or payout information

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

## Test Results

### Current Status: ✅ All 12 Tests Passing

| Category | Tests | Status |
|----------|-------|--------|
| Happy Path | 4 | ✅ Passing |
| Filtering & List | 4 | ✅ Passing |
| Negative/Validation | 4 | ✅ Passing |
| **Total** | **12** | **✅ Passing** |

#### Happy Path Tests
- ✓ Create claim
- ✓ Retrieve claim
- ✓ Update status through lifecycle
- ✓ List claims

#### Filter Tests
- ✓ Filter by status
- ✓ Filter by policy number
- ✓ Filter by claimant name (partial match)
- ✓ Pagination metadata

#### Negative/Validation Tests
- ✓ Missing required field (`policyNumber`)
- ✓ Invalid status transition (PAID → OPEN)
- ✓ Claim not found (404)
- ✓ Missing payout amount when transitioning to APPROVED

---

## Architecture & Design

### Test Structure

**ApiClient** (`tests/utils/apiClient.ts`)
- Generic HTTP client wrapping Playwright's `APIRequestContext`
- Supports POST, GET, PATCH methods
- Type-safe with optional response typing
- Exported `ApiError` interface for error response types

**Mock Server** (`mock-server/server.ts`)
- Express.js server simulating a full claims API
- In-memory data store (cleared on reset)
- Validates required fields
- Enforces state transitions
- Provides filtering and pagination

### Best Practices Implemented

- ✅ **Isolated tests** – Each test gets its own `request` fixture
- ✅ **Data isolation** – Tests call `POST /reset` before seeding data
- ✅ **Type safety** – TypeScript with Playwright test typing
- ✅ **Reusable client** – Single `ApiClient` class reduces boilerplate
- ✅ **Clear reporting** – HTML reports with detailed failure info
- ✅ **CI/CD ready** – GitHub Actions workflow included

---

## Contributing

To add more tests:

1. Create a new test file in `tests/api/`
2. Use the `ApiClient` for HTTP requests
3. Each test should receive `{ request }` fixture
4. Use `client.post("/reset", {})` to reset data between tests if needed

---

## Troubleshooting

### Tests hang or timeout
```bash
# Ensure port 3000 is not in use
lsof -i :3000
kill -9 <PID>

# Try running tests again
npm test
```

### Browser installation issues
```bash
# Reinstall Playwright browsers
npx playwright install --with-deps

# Run tests
npm test
```

### Clear test reports
```bash
rm -rf playwright-report/
npm test
```





