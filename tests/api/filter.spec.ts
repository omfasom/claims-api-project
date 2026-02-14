// tests/api/filter.spec.ts
import { test, expect } from "@playwright/test";
import { ApiClient } from "../utils/apiClient";

test.describe("Claims API – List / Filter Tests", () => {
    let client: ApiClient;
    let claimIds: string[] = [];

    test.beforeAll(async ({ request }) => {
        client = new ApiClient(request);

        // Seed some claims
        const claims = [
            {
                policyNumber: "POL-2024-01001",
                claimantName: "Alice",
                damageDate: "2024-01-15",
                lossDescription: "Roof damage due to storm",
            },
            {
                policyNumber: "POL-2024-01002",
                claimantName: "Bob",
                damageDate: "2024-02-20",
                lossDescription: "Car accident",
            },
            {
                policyNumber: "POL-2024-01003",
                claimantName: "Charlie",
                damageDate: "2024-03-10",
                lossDescription: "Kitchen fire",
            },
        ];

        for (const c of claims) {
            const claim: any  = await client.post("/claims", c);
            claimIds.push(claim.id);
        }
    });

    test("GET /claims – filter by status", async () => {
        const list: any  = await client.get("/claims", { status: "OPEN" });
        expect(list.data.length).toBeGreaterThanOrEqual(3);
        expect(list.data.every((c: any) => c.status === "OPEN")).toBeTruthy();
    });

    test("GET /claims – filter by policyNumber", async () => {
        const list: any  = await client.get("/claims", { policyNumber: "POL-2024-01001" });
        expect(list.data.length).toBe(1);
        expect(list.data[0].claimantName).toBe("Alice");
    });

    test("GET /claims – filter by claimantName partial match", async () => {
        const list: any  = await client.get("/claims", { claimantName: "ar" });
        expect(list.data.length).toBe(1);
        expect(list.data[0].claimantName).toBe("Charlie");
    });

    test("GET /claims – pagination (mocked via meta)", async () => {
        const list: any  = await client.get("/claims");
        expect(list.meta.totalItems).toBeGreaterThanOrEqual(3);
        expect(list.meta.page).toBe(1);
        expect(list.meta.totalPages).toBe(1);
    });
});
