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





