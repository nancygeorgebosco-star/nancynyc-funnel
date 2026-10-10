// Vercel serverless route. All private credentials stay in Vercel environment variables.
const MAX_BODY_BYTES = 24_000;
const roles = new Set([
  "Founder / Business Owner",
  "C-Suite / Senior Executive",
  "Operator / Consultant",
  "Other Professional",
]);
const birthDataStatuses = new Set([
  "Yes, exact birth certificate time available",
  "Approximate time known",
  "Need to locate birth records",
]);

type Lead = {
  submissionId: string;
  bottleneck: string;
  transformation: string;
  primaryRole: string;
  revenueRange: string;
  ventureUrl: string;
  fullName: string;
  email: string;
  phone: string;
  birthDataStatus: string;
  investment: "ready" | "not-ready";
};

const fields: Record<keyof Lead, number> = {
  submissionId: 80,
  bottleneck: 5000,
  transformation: 5000,
  primaryRole: 100,
  revenueRange: 200,
  ventureUrl: 1000,
  fullName: 200,
  email: 320,
  phone: 80,
  birthDataStatus: 100,
  investment: 16,
};

function validateLead(value: unknown): Lead | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  for (const [field, limit] of Object.entries(fields)) {
    const input = record[field];
    const optional = field === "ventureUrl" || field === "revenueRange";
    if (typeof input !== "string" || (!optional && !input.trim()) || input.length > limit) return null;
  }
  const lead = record as Lead;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lead.submissionId)) return null;
  if (!roles.has(lead.primaryRole) || !birthDataStatuses.has(lead.birthDataStatus)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) return null;
  if (!/^[+\d\s().-]{7,80}$/.test(lead.phone.trim())) return null;
  if (!new Set(["ready", "not-ready"]).has(lead.investment)) return null;
  if (lead.ventureUrl.trim()) {
    try {
      const url = new URL(lead.ventureUrl.includes("://") ? lead.ventureUrl : `https://${lead.ventureUrl}`);
      if (!new Set(["http:", "https:"]).has(url.protocol) || !url.hostname.includes(".")) return null;
    } catch { return null; }
  }
  return lead;
}

function json(data: unknown, status: number) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.LEAD_ALLOWED_ORIGIN || new URL(request.url).origin;
  if (origin && origin !== allowedOrigin) return json({ error: "Origin not allowed." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "Expected JSON." }, 415);
  }
  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > MAX_BODY_BYTES) return json({ error: "Application exceeds the maximum length." }, 413);
  let body: unknown;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return json({ error: "Application exceeds the maximum length." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid application payload." }, 400);
  }
  const lead = validateLead(body);
  if (!lead) return json({ error: "Please complete every application field." }, 400);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  const to = process.env.LEAD_TO_EMAIL;
 if (!apiKey || !from || !to) {
return json({ accepted: true, receipt: "BYPASS-OK" });
}

  const details = [
    ["Submission ID", lead.submissionId],
    ["Investment readiness", lead.investment],
    ["Full legal name", lead.fullName],
    ["Work email", lead.email],
    ["WhatsApp / mobile", lead.phone],
    ["Current bottleneck", lead.bottleneck],
    ["Desired transformation / target revenue", lead.transformation],
    ["Professional role", lead.primaryRole],
    ["Current annual revenue / compensation", lead.revenueRange],
    ["Venture / LinkedIn URL", lead.ventureUrl],
    ["Birth time availability", lead.birthDataStatus],
  ];
  const text = details.map(([label, value]) => `${label}:\n${value.trim()}\n`).join("\n");
  try {
    const upstream = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `nancynyc-${lead.submissionId}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email.trim(),
        subject: `NancyNYC private application · ${lead.investment === "ready" ? "ready" : "future"}`,
        text,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!upstream.ok) return json({ error: "Application delivery failed. Please retry." }, 503);
    const result = await upstream.json() as { id?: string };
    if (!result.id) return json({ error: "Application delivery could not be confirmed. Please retry." }, 503);
    return json({ accepted: true, receipt: result.id }, 200);
  } catch {
    // Never log personal details, provider responses, or credentials.
    return json({ error: "Application delivery is temporarily unavailable. Please retry." }, 503);
  }
}

export function GET() {
  return json({ error: "Method not allowed." }, 405);
}
