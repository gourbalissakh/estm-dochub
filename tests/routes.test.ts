import http from "node:http";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    filiere: {
      findMany: vi.fn(async () => [{ id: "f1", name: "Genie Logiciel", code: "GL", sector: "TECH" }]),
    },
    document: {
      findMany: vi.fn(async () => []),
      count: vi.fn(async () => 0),
    },
  },
}));

function appFromRoute(handler: (request: any) => Promise<Response>) {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(`http://localhost${req.url}`);
      const nextRequest = Object.assign(new Request(url), { nextUrl: url });
      const response = await handler(nextRequest as any);
      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      res.statusCode = 500;
      res.end(error instanceof Error ? error.message : "Route error");
    }
  });
}

describe("routes API critiques", () => {
  it("GET /api/filieres renvoie les filieres", async () => {
    const { GET } = await import("@/app/api/filieres/route");
    const res = await request(appFromRoute(GET)).get("/api/filieres").expect(200);
    expect(res.body.filieres[0].code).toBe("GL");
  });

  it("GET /api/documents renvoie la pagination", async () => {
    const { GET } = await import("@/app/api/documents/route");
    const res = await request(appFromRoute(GET)).get("/api/documents?page=1&sort=recent").expect(200);
    expect(res.body.pagination).toEqual({ page: 1, total: 0, pages: 0 });
  });
});
