import express, { Request, Response } from "express";
import bodyParser from "body-parser";


const app = express();
app.use(bodyParser.json());

type ClaimStatus = "OPEN" | "IN_REVIEW" | "APPROVED" | "PAID" | "REJECTED";

interface Claim {
    id: string;
    policyNumber: string;
    claimantName: string;
    damageDate: string;
    lossDescription: string;
    status: ClaimStatus;
    payoutAmount?: number | null;
    payoutDate?: string | null;
    createdAt: string;
    updatedAt: string;
}

let claims: Claim[] = [];

// POST /claims
app.post("/claims", (req: Request, res: Response) => {
    const { policyNumber, claimantName, damageDate, lossDescription, status } = req.body;

    if (!policyNumber || !claimantName || !damageDate || !lossDescription) {
        return res.status(400).json({
            code: "BAD_REQUEST",
            message: "Missing required field",
        });
    }

    const newClaim: Claim = {
        id: `CLM-${Date.now()}`,
        policyNumber,
        claimantName,
        damageDate,
        lossDescription,
        status: status || "OPEN",
        payoutAmount: null,
        payoutDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    claims.push(newClaim);
    res.status(201).json(newClaim);
});

// GET /claims
app.get("/claims", (req: Request, res: Response) => {
    let filtered = claims;

    if (req.query.status) {
        const statuses = Array.isArray(req.query.status) ? req.query.status : [req.query.status];
        filtered = filtered.filter(c => statuses.includes(c.status));
    }

    if (req.query.policyNumber) {
        filtered = filtered.filter(c => c.policyNumber === req.query.policyNumber);
    }

    if (req.query.claimantName) {
        const name = String(req.query.claimantName).toLowerCase();
        filtered = filtered.filter(c => c.claimantName.toLowerCase().includes(name));
    }

    res.json({
        data: filtered,
        meta: {
            page: 1,
            pageSize: filtered.length,
            totalItems: filtered.length,
            totalPages: 1,
        },
    });
});

// GET /claims/:id
app.get("/claims/:id", (req: Request, res: Response) => {
    const claim = claims.find(c => c.id === req.params.id);
    if (!claim) return res.status(404).json({ code: "CLAIM_NOT_FOUND", message: "No claim found with id" });
    res.json(claim);
});

// PATCH /claims/:id
app.patch("/claims/:id", (req: Request, res: Response) => {
    const claim = claims.find(c => c.id === req.params.id);
    if (!claim) return res.status(404).json({ code: "CLAIM_NOT_FOUND", message: "No claim found with id" });

    const { status, payoutAmount, payoutDate } = req.body;

    const allowedTransitions: Record<ClaimStatus, ClaimStatus[]> = {
        OPEN: ["IN_REVIEW", "REJECTED"],
        IN_REVIEW: ["APPROVED", "REJECTED"],
        APPROVED: ["PAID"],
        PAID: [],
        REJECTED: [],
    };

    if (status && !allowedTransitions[claim.status].includes(status)) {
        return res.status(422).json({ code: "INVALID_STATUS_TRANSITION", message: `Cannot transition from ${claim.status} to ${status}` });
    }

    if (status) claim.status = status;
    if (payoutAmount !== undefined) claim.payoutAmount = payoutAmount;
    if (payoutDate) claim.payoutDate = payoutDate;
    claim.updatedAt = new Date().toISOString();

    res.json(claim);
});

app.listen(3000, () => console.log("Mock server running at http://localhost:3000"));
