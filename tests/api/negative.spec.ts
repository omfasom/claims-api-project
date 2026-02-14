// tests/api/negative.spec.ts
import { test, expect } from "@playwright/test";
import { ApiClient } from "../utils/apiClient";

test.describe("Claims API – Negative / Validation Tests", () => {
    test("POST /claims – missing required field policyNumber", async ({ request }) => {
        const client = new ApiClient(request);
        const response : any = await client.post("/claims", {
            claimantName: "Hans Schmidt",
            damageDate: "2024-12-01",
            lossDescription: "Vehicle stolen from parking garage overnight",
        });

        expect(response.code).toBe("BAD_REQUEST");
    });

    test("PATCH /claims/:id – invalid status transition (PAID → OPEN)", async ({ request }) => {
        const client = new ApiClient(request);
        // Create claim and set to PAID first
        const claim : any  = await client.post("/claims", {
            policyNumber: "POL-2024-00234",
            claimantName: "Lisa Meier",
            damageDate: "2024-11-20",
            lossDescription: "Water damage in bathroom",
        });

        const paid : any = await client.patch(`/claims/${claim.id}`, {
            status: "APPROVED",
            payoutAmount: 2000,
        });

        await client.patch(`/claims/${claim.id}`, {
            status: "PAID",
            payoutAmount: 2000,
            payoutDate: "2024-12-10",
        });

        // Attempt invalid transition
        const invalid: any  = await client.patch(`/claims/${claim.id}`, { status: "OPEN" });
        expect(invalid.code).toBe("INVALID_STATUS_TRANSITION");
    });

    test("GET /claims/:id – claim not found", async ({ request }) => {
        const client = new ApiClient(request);
        const response: any  = await client.get("/claims/NOT_EXISTING_ID");
        expect(response.code).toBe("CLAIM_NOT_FOUND");
    });

    test("PATCH /claims/:id – missing payoutAmount when APPROVED", async ({ request }) => {
        const client = new ApiClient(request);
        const claim: any  = await client.post("/claims", {
            policyNumber: "POL-2024-00345",
            claimantName: "Max Mustermann",
            damageDate: "2024-12-01",
            lossDescription: "Fire damage in kitchen",
        });

        // Attempt to approve without payoutAmount
        const response: any  = await client.patch(`/claims/${claim.id}`, { status: "APPROVED" });
        expect(response.code).toBe("INVALID_STATUS_TRANSITION"); // Our mock server requires valid transition
    });
});
