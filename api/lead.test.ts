import { afterEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./lead";

const validLead = {
  submissionId: "550e8400-e29b-41d4-a716-446655440000",
  bottleneck: "Missed expansion windows",
  transformation: "Revenue target $3M with calm execution",
  primaryRole: "Founder / Business Owner",
  revenueRange: "$1M–$3M annually",
  ventureUrl: "https://example.test",
  fullName: "Alex Example",
  email: "alex@example.test",
  phone: "+1 212 555 0100",
  birthDataStatus: "Approximate time known",
  investment: "ready" as const,
};

function submit(body: unknown, origin = "https://nancynyc.example") {
  return POST(new Request("https://nancynyc.example/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("private application endpoint", () => {
  it("rejects GET, incomplete payloads, and cross-origin submissions", async () => {
    expect((await GET()).status).toBe(405);
    expect((await submit({ ...validLead, primaryRole: "" })).status).toBe(400);
    expect((await submit({ ...validLead, ventureUrl: "not a URL" })).status).toBe(400);
    expect((await submit(validLead, "https://other.example")).status).toBe(403);
  });

  it("fails closed when email delivery is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("LEAD_FROM_EMAIL", "");
    vi.stubEnv("LEAD_TO_EMAIL", "");
    const response = await submit(validLead);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: expect.any(String) });
  });

  it("sends the complete application, including revenue and birth-time availability, before acknowledging it", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-only-key");
    vi.stubEnv("LEAD_FROM_EMAIL", "NancyNYC <apply@example.test>");
    vi.stubEnv("LEAD_TO_EMAIL", "nancy@example.test");
    const provider = vi.fn().mockResolvedValue(Response.json({ id: "email-confirmed-id" }));
    vi.stubGlobal("fetch", provider);
    const response = await submit(validLead);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ accepted: true, receipt: "email-confirmed-id" });
    const [url, options] = provider.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.headers["Idempotency-Key"]).toBe(`nancynyc-${validLead.submissionId}`);
    const sent = JSON.parse(options.body);
    expect(sent.to).toEqual(["nancy@example.test"]);
    for (const value of Object.values(validLead)) expect(sent.text).toContain(value);
  });

  it("accepts an empty private venture URL and optional revenue range as empty strings", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-only-key");
    vi.stubEnv("LEAD_FROM_EMAIL", "apply@example.test");
    vi.stubEnv("LEAD_TO_EMAIL", "nancy@example.test");
    const provider = vi.fn().mockResolvedValue(Response.json({ id: "private-lead-id" }));
    vi.stubGlobal("fetch", provider);
    const response = await submit({ ...validLead, ventureUrl: "", revenueRange: "" });
    expect(response.status).toBe(200);
    const sent = JSON.parse(provider.mock.calls[0][1].body);
    expect(sent.text).toContain("Venture / LinkedIn URL:\n\n");
    expect(sent.text).toContain("Current annual revenue / compensation:\n\n");
  });

  it("never acknowledges a provider failure or missing provider receipt", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-only-key");
    vi.stubEnv("LEAD_FROM_EMAIL", "apply@example.test");
    vi.stubEnv("LEAD_TO_EMAIL", "nancy@example.test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("error", { status: 500 })).mockResolvedValueOnce(Response.json({})));
    expect((await submit(validLead)).status).toBe(503);
    expect((await submit(validLead)).status).toBe(503);
  });
});
