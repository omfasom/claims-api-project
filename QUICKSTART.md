# Claims API – Quick Start Guide

## Step-by-Step Instructions to Run Tests

### Prerequisites
Make sure you have installed:
- Node.js 20 or higher
- npm (comes with Node.js)
- Git

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/omfasom/claims-api-project.git
cd claims-api-project
```

---

## Step 2: Install Dependencies

```bash
npm ci
```

This command installs all required packages from `package.json`.

**What it installs:**
- `@playwright/test` - Testing framework
- `ts-node` - TypeScript runtime
- `typescript` - TypeScript compiler
- `express` - Mock server framework
- `start-server-and-test` - Server management tool
- Other utilities

---

## Step 3: Install Playwright Browsers (One-time Setup)

```bash
npx playwright install chromium --with-deps
```

This downloads the Chromium browser needed to run tests. You only need to do this once.

---

## Step 4: Run the Tests

### Option A: Automatic Mode (Recommended)
This automatically starts the mock server, runs tests, and stops the server:

```bash
npm test
```

**What happens:**
1. ✅ Mock server starts on `http://localhost:3000`
2. ✅ Waits for server to be ready
3. ✅ Runs all 12 tests
4. ✅ Server stops automatically
5. ✅ Generates HTML report

---

### Option B: Run with Visible Browser

See the tests running in a real browser window:

```bash
npm run test:headed
```

---

### Option C: Debug Mode

Step through tests one by one in Playwright Inspector:

```bash
npm run test:debug
```

---

### Option D: Manual Mode (Advanced)

If you want to start the server separately:

**Terminal 1 - Start the mock server:**
```bash
npm run mock
```

You should see:
```
> claims-api-project@1.0.0 mock
> ts-node mock-server/server.ts

Mock server running at http://localhost:3000
```

**Terminal 2 - Run tests in another terminal:**
```bash
npx playwright test
```

---

## Step 5: View Test Results

After tests complete, open the HTML report:

```bash
npx playwright show-report
```

This opens a browser window with detailed test results, including:
- ✅ Pass/fail status
- ⏱️ Test duration
- 📊 Step-by-step execution
- 📸 Screenshots (if any)

---

## Common Commands Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests (recommended) |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:debug` | Debug mode with inspector |
| `npm run mock` | Start mock server only |
| `npx playwright show-report` | View last test report |
| `npx playwright test --reporter=list` | Simple text output |

---

## Troubleshooting

### Issue: Tests won't start

**Solution 1: Kill any running processes on port 3000**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process (replace XXXX with PID from above)
kill -9 XXXX
```

**Solution 2: Reinstall Playwright browsers**
```bash
npx playwright install --with-deps
npm test
```

---

### Issue: "command not found: npm"

Make sure Node.js is installed:
```bash
node --version
npm --version
```

If not installed, download from https://nodejs.org/

---

### Issue: Tests run but fail

Check that the mock server is responding:
```bash
# In another terminal, while server is running:
curl http://localhost:3000/claims
```

Should return:
```json
{"data":[],"meta":{"page":1,"pageSize":0,"totalItems":0,"totalPages":1}}
```

---

## What the Tests Do

### Happy Path Tests (4 tests)
✅ Create a claim  
✅ Retrieve claim  
✅ Update status through lifecycle  
✅ List all claims  

### Validation Tests (4 tests)
✅ Missing required field  
✅ Invalid status transition  
✅ Claim not found  
✅ Missing payout amount  

### Filter Tests (4 tests)
✅ Filter by status  
✅ Filter by policy number  
✅ Filter by claimant name  
✅ Pagination metadata  

---

## Expected Output

When all tests pass, you should see:
```
Running 12 tests using 1 worker

  ✓ 1 [chromium] › tests/api/claims.spec.ts:8:9 › Create claim (35ms)
  ✓ 2 [chromium] › tests/api/claims.spec.ts:22:9 › Retrieve claim (6ms)
  ✓ 3 [chromium] › tests/api/claims.spec.ts:29:9 › Update status through lifecycle (11ms)
  ✓ 4 [chromium] › tests/api/claims.spec.ts:47:9 › List claims (5ms)
  ✓ 5 [chromium] › tests/api/filter.spec.ts:44:9 › GET /claims – filter by status (14ms)
  ✓ 6 [chromium] › tests/api/filter.spec.ts:51:9 › GET /claims – filter by policyNumber (12ms)
  ✓ 7 [chromium] › tests/api/filter.spec.ts:58:9 › GET /claims – filter by claimantName (8ms)
  ✓ 8 [chromium] › tests/api/filter.spec.ts:65:9 › GET /claims – pagination (8ms)
  ✓ 9 [chromium] › tests/api/negative.spec.ts:6:9 › Missing required field (3ms)
  ✓ 10 [chromium] › tests/api/negative.spec.ts:17:9 › Invalid status transition (6ms)
  ✓ 11 [chromium] › tests/api/negative.spec.ts:43:9 › Claim not found (3ms)
  ✓ 12 [chromium] › tests/api/negative.spec.ts:49:9 › Missing payout amount (3ms)

  12 passed (882ms)
```

---

## Next Steps

### To run tests in CI/CD (GitHub Actions)
Just push your code to GitHub:
```bash
git push origin main
```

The workflow in `.github/workflows/tests.yml` will automatically:
1. Install dependencies
2. Start mock server
3. Run all tests
4. Upload test report

---

## Quick Cheat Sheet

```bash
# First time setup
git clone https://github.com/omfasom/claims-api-project.git
cd claims-api-project
npm ci
npx playwright install chromium --with-deps

# Run tests
npm test

# View results
npx playwright show-report
```

That's it! You're ready to go! 🚀

