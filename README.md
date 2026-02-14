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
- Playwright

```bash
npm install
npx playwright install
```

### Run Mock Server
```bash
npx ts-node mock-server/server.ts
```

### Run Tests in Mock Server
```bash
API_BASE_URL=http://localhost:3000 npx playwright test
```

### Run Tests in Staging
```bash
API_BASE_URL=https://api.staging.example.com/v1 npx playwright test
```

### Run Tests in Production
```bash
API_BASE_URL=https://api.example.com/v1 npx playwright test
```





