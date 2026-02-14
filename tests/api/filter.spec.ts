// tests/api/filter.spec.ts
import { test, expect } from "@playwright/test";
import { ApiClient } from "../utils/apiClient";

test.describe("Claims API – List / Filter Tests", () => {
    let claimIds: string[] = [];

    test.beforeEach(async ({ request }) => {
        const client = new ApiClient(request);

        // Reset server data before each test
        await client.post("/reset", {});

        claimIds = [];

        // Seed test claims with realistic Turkish names and scenarios
        const claims = [
            {
                policyNumber: "POL-2024-05621",
                claimantName: "Fatih Aydogan",
                damageDate: "2024-01-15",
                lossDescription: "Storm damage to roof tiles",
            },
            {
                policyNumber: "POL-2024-04987",
                claimantName: "Zeynep Koc",
                damageDate: "2024-02-20",
                lossDescription: "Traffic accident in Ankara",
            },
            {
                policyNumber: "POL-2024-03456",
                claimantName: "Burak Ozdemir",
                damageDate: "2024-03-10",
                lossDescription: "Kitchen appliance fire",
            },
        ];

        for (const c of claims) {
            const claim: any = await client.post("/claims", c);
            claimIds.push(claim.id);
        }
    });

    test("GET /claims – filter by status", async ({ request }) => {
        const client = new ApiClient(request);
        const list: any = await client.get("/claims", { status: "OPEN" });
        expect(list.data.length).toBeGreaterThanOrEqual(3);
        expect(list.data.every((c: any) => c.status === "OPEN")).toBeTruthy();
    });

    test("GET /claims – filter by policyNumber", async ({ request }) => {
        const client = new ApiClient(request);
        const list: any = await client.get("/claims", { policyNumber: "POL-2024-05621" });
        expect(list.data.length).toBe(1);
        expect(list.data[0].claimantName).toBe("Fatih Aydogan");
    });

    test("GET /claims – filter by claimantName partial match", async ({ request }) => {
        const client = new ApiClient(request);
        const list: any = await client.get("/claims", { claimantName: "ura" });
        expect(list.data.length).toBe(1);
        expect(list.data[0].claimantName).toBe("Burak Ozdemir");
    });

    test("GET /claims – pagination (mocked via meta)", async ({ request }) => {
        const client = new ApiClient(request);
        const list: any = await client.get("/claims");
        expect(list.meta.totalItems).toBeGreaterThanOrEqual(3);
        expect(list.meta.page).toBe(1);
        expect(list.meta.totalPages).toBe(1);
    });
});
