// tests/api/claims.spec.ts
import { test, expect, APIRequestContext } from "@playwright/test";
import { ApiClient } from "../utils/apiClient";

test.describe("Claims API – Happy Path", () => {
    let client: ApiClient;
    let claimId: string;

    test.beforeAll(async ({ request }) => {
        client = new ApiClient(request);
    });

    test("Create claim", async () => {
        const claim: any  = await client.post("/claims", {
            policyNumber: "POL-2024-00123",
            claimantName: "Maria Müller",
            damageDate: "2024-11-15",
            lossDescription: "Kitchen fire caused smoke and damage",
        });

        expect(claim.id).toBeDefined();
        expect(claim.status).toBe("OPEN");
        claimId = claim.id;
    });

    test("Retrieve claim", async () => {
        const claim: any  = await client.get(`/claims/${claimId}`);
        expect(claim.id).toBe(claimId);
        expect(claim.policyNumber).toBe("POL-2024-00123");
    });

    test("Update status through lifecycle", async () => {
        let claim: any  = await client.patch(`/claims/${claimId}`, { status: "IN_REVIEW" });
        expect(claim.status).toBe("IN_REVIEW");

        claim = await client.patch(`/claims/${claimId}`, { status: "APPROVED", payoutAmount: 4500 });
        expect(claim.status).toBe("APPROVED");
        expect(claim.payoutAmount).toBe(4500);

        claim = await client.patch(`/claims/${claimId}`, { status: "PAID", payoutAmount: 4500, payoutDate: "2024-12-20" });
        expect(claim.status).toBe("PAID");
        expect(claim.payoutDate).toBe("2024-12-20");
    });

    test("List claims", async () => {
        const list: any  = await client.get("/claims");
        expect(list.data.length).toBeGreaterThan(0);
    });
});
