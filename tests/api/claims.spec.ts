// tests/api/claims.spec.ts
import { test, expect } from "@playwright/test";
import { ApiClient } from "../utils/apiClient";

test.describe("Claims API – Happy Path", () => {
    let claimId: string;

    test("Create claim", async ({ request }) => {
        const client = new ApiClient(request);
        const claim: any = await client.post("/claims", {
            policyNumber: "POL-2024-08567",
            claimantName: "Omer Somuncu",
            damageDate: "2024-11-15",
            lossDescription: "Water damage in bathroom from pipe rupture",
        });

        expect(claim.id).toBeDefined();
        expect(claim.status).toBe("OPEN");
        claimId = claim.id;
    });

    test("Retrieve claim", async ({ request }) => {
        const client = new ApiClient(request);
        const claim: any = await client.get(`/claims/${claimId}`);
        expect(claim.id).toBe(claimId);
        expect(claim.policyNumber).toBe("POL-2024-08567");
    });

    test("Update status through lifecycle", async ({ request }) => {
        const client = new ApiClient(request);
        let claim: any = await client.patch(`/claims/${claimId}`, { status: "IN_REVIEW" });
        expect(claim.status).toBe("IN_REVIEW");

        claim = await client.patch(`/claims/${claimId}`, { status: "APPROVED", payoutAmount: 3200 });
        expect(claim.status).toBe("APPROVED");
        expect(claim.payoutAmount).toBe(3200);

        claim = await client.patch(`/claims/${claimId}`, {
            status: "PAID",
            payoutAmount: 3200,
            payoutDate: "2024-12-10"
        });
        expect(claim.status).toBe("PAID");
        expect(claim.payoutDate).toBe("2024-12-10");
    });

    test("List claims", async ({ request }) => {
        const client = new ApiClient(request);
        const list: any = await client.get("/claims");
        expect(list.data.length).toBeGreaterThan(0);
    });
});


