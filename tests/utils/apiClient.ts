// tests/utils/apiClient.ts
import { APIRequestContext } from "@playwright/test";

export interface ApiError {
    code: string;
    message?: string;
    // optional http status for convenience
    status?: number;
}

export class ApiClient {
    constructor(private request: APIRequestContext) {}

    // return type defaults to `any` to avoid needing to annotate every call in tests
    async post<T = any>(endpoint: string, data: Record<string, unknown>): Promise<T> {
        const res = await this.request.post(endpoint, { data });
        const json = await res.json();
        return json as T;
    }

    // params typed to match Playwright's expected shapes
    async get<T = any>(endpoint: string, params?: Record<string, string | number | boolean> | URLSearchParams | string): Promise<T> {
        const res = await this.request.get(endpoint, { params });
        const json = await res.json();
        return json as T;
    }

    async patch<T = any>(endpoint: string, data: Record<string, unknown>): Promise<T> {
        const res = await this.request.patch(endpoint, { data });
        const json = await res.json();
        return json as T;
    }
}
