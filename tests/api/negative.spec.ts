// tests/api/negative.spec.ts
import { test, expect } from "@playwright/test";
import { ApiClient } from "../utils/apiClient";

test.describe("Claims API – Negative / Validation Tests", () => {
    test("POST /claims – missing required field policyNumber", async ({ request }) => {
        const client = new ApiClient(request);
        const response: any = await client.post("/claims", {
            claimantName: "Ozan Dursun",
            damageDate: "2024-12-01",
            lossDescription: "Car accident on highway near Istanbul",
        });

        expect(response.code).toBe("BAD_REQUEST");
    });

    test("PATCH /claims/:id – invalid status transition (PAID → OPEN)", async ({ request }) => {
        const client = new ApiClient(request);
        // Create claim and process to PAID status
        const claim: any = await client.post("/claims", {
            policyNumber: "POL-2024-07834",
            claimantName: "Ayse Yilmaz",
            damageDate: "2024-11-20",
            lossDescription: "Flood damage from heavy rainfall",
        });

        await client.patch(`/claims/${claim.id}`, {
            status: "APPROVED",
            payoutAmount: 5500,
        });

        await client.patch(`/claims/${claim.id}`, {
            status: "PAID",
            payoutAmount: 5500,
            payoutDate: "2024-12-05",
        });

        // Attempt invalid transition back to OPEN
        const invalid: any = await client.patch(`/claims/${claim.id}`, { status: "OPEN" });
        expect(invalid.code).toBe("INVALID_STATUS_TRANSITION");
    });

    test("GET /claims/:id – claim not found", async ({ request }) => {
        const client = new ApiClient(request);
        const response: any = await client.get("/claims/CLM-INVALID-99999");
        expect(response.code).toBe("CLAIM_NOT_FOUND");
    });

    test("PATCH /claims/:id – missing payoutAmount when APPROVED", async ({ request }) => {
        const client = new ApiClient(request);
        const claim: any = await client.post("/claims", {
            policyNumber: "POL-2024-06421",
            claimantName: "Mehmet Kaya",
            damageDate: "2024-12-01",
            lossDescription: "Electrical fire in kitchen",
        });

        // Attempt to approve without specifying payout amount
        const response: any = await client.patch(`/claims/${claim.id}`, { status: "APPROVED" });
        expect(response.code).toBe("INVALID_STATUS_TRANSITION");
    });
});


