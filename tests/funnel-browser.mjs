import { spawn } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";

const targetUrl = "http://127.0.0.1:3001/?verify=vercel-lead-gate";
const profiles = [
  { name: "desktop", width: 1440, height: 1000, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const port = 9377;
const directory = "/tmp/nancynyc-funnel-test-chrome";
rmSync(directory, { recursive: true, force: true });
const chrome = spawn("/usr/bin/chromium", ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", `--remote-debugging-port=${port}`, `--user-data-dir=${directory}`, "about:blank"], { stdio: "ignore" });
let socket;
try {
  let browser;
  for (let i = 0; i < 70; i++) {
    try {
      const reply = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (reply.ok) { browser = await reply.json(); break; }
    } catch { /* warming up */ }
    await pause(100);
  }
  if (!browser) throw new Error("Chromium did not start");
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  const pending = new Map();
  let sequence = 0;
  socket.addEventListener("message", (event) => {
    const response = JSON.parse(event.data);
    if (!pending.has(response.id)) return;
    const { resolve, reject } = pending.get(response.id);
    pending.delete(response.id);
    if (response.error) reject(new Error(response.error.message)); else resolve(response.result);
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const output = await command("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (output.exceptionDetails) throw new Error(output.exceptionDetails.exception?.description || output.exceptionDetails.text);
    return output.result.value;
  };
  const click = async (text) => {
    const found = await evaluate(`(() => {
      const q = ${JSON.stringify(text.toUpperCase())};
      const button = [...document.querySelectorAll('button, a')].find(el => el.getBoundingClientRect().width > 0 && el.textContent?.toUpperCase().includes(q));
      if (!button) return false; button.click(); return true;
    })()`);
    if (!found) throw new Error(`Control missing: ${text}`);
    await pause(150);
  };
  const fill = async (selector, value) => {
    const found = await evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      const base = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(base, 'value').set.call(el, ${JSON.stringify(value)});
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`);
    if (!found) throw new Error(`Field missing: ${selector}`);
    await pause(80);
  };
  const state = () => evaluate(`(() => {
    const d = document.querySelector('[role="dialog"]');
    return { text: d?.innerText || '', calendar: Boolean(d?.querySelector('iframe[title^="Acuity Scheduling"]')), iframeSrc: d?.querySelector('iframe[title^="Acuity Scheduling"]')?.getAttribute('src') || '', overflow: d ? d.scrollWidth > d.clientWidth : null, width: d?.getBoundingClientRect().width || 0, calls: window.__leadCalls || [] };
  })()`);
  const populate = async () => {
    await click("APPLY FOR PRIVATE ADVISORY");
    await fill('textarea[aria-label="The Bottleneck"]', "The team misses key timing windows.");
    await click("CONTINUE");
    await fill('textarea[aria-label="The Desired Transformation"]', "Revenue target $3M with calm execution.");
    await click("CONTINUE");
    await click("FOUNDER / BUSINESS OWNER");
    await fill("#venture-url", "not a URL");
    await click("CONTINUE");
    if (!(await state()).text.includes("Enter a valid website or LinkedIn URL.")) throw new Error("Malformed optional URL was accepted");
    await fill("#venture-url", "");
    await click("CONTINUE");
    await fill('input[autocomplete="name"]', "Alex Example");
    await fill('input[autocomplete="email"]', "alex@example.test");
    await fill('input[autocomplete="tel"]', "+1 212 555 0100");
    await click("APPROXIMATE TIME KNOWN");
    await click("CONTINUE");
  };

  await command("Page.enable");
  await command("Runtime.enable");
  const results = [];
  for (const profile of profiles) {
    await command("Emulation.setDeviceMetricsOverride", { width: profile.width, height: profile.height, deviceScaleFactor: 1, mobile: profile.mobile });
    await command("Page.addScriptToEvaluateOnNewDocument", { source: `
      window.__leadCalls = [];
      window.__acceptLeads = false;
      const originalFetch = window.fetch.bind(window);
      window.fetch = async (resource, options) => {
        if (String(resource) !== '/api/lead') return originalFetch(resource, options);
        const data = JSON.parse(options.body); window.__leadCalls.push(data);
        return window.__acceptLeads
          ? new Response(JSON.stringify({ accepted: true, receipt: 'test-receipt' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
          : new Response(JSON.stringify({ error: 'Delivery unavailable; retry.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
      };
    ` });
    await command("Page.navigate", { url: targetUrl + `&viewport=${profile.name}` });
    await pause(1800);
    await populate();
    const ready = await state();
    if (!ready.text.includes("CONFIRM INVESTMENT READINESS") || ready.calls.length) throw new Error("Step 5 failed before submission");
    await click("YES — $15,000 AVAILABLE");
    const failed = await state();
    if (!failed.text.includes("Delivery unavailable; retry.") || failed.calendar || failed.calls.length !== 1) throw new Error("Calendar displayed after failed lead capture");
    await evaluate("window.__acceptLeads = true");
    await click("YES — $15,000 AVAILABLE");
    const accepted = await state();
    const expected = ["bottleneck", "transformation", "primaryRole", "revenueRange", "ventureUrl", "fullName", "email", "phone", "birthDataStatus", "investment", "submissionId"];
    if (!accepted.calendar || accepted.calls.length !== 2 || !expected.every(x => Object.hasOwn(accepted.calls[1], x))) throw new Error("Lead gate did not collect the entire payload before calendar");
    if (accepted.calls[0].submissionId !== accepted.calls[1].submissionId) throw new Error("Retry did not preserve the idempotency key");
    const booking = new URL(accepted.iframeSrc);
    if (booking.searchParams.get("owner") !== "33157398" || booking.searchParams.get("appointmentType") !== "99028191" || booking.searchParams.get("first_name") !== "Alex" || booking.searchParams.get("last_name") !== "Example") throw new Error("Acuity prefill is incorrect");
    await command("Page.navigate", { url: targetUrl + `&viewport=${profile.name}&branch=not-ready` });
    await pause(1600);
    await populate();
    await evaluate("window.__acceptLeads = true");
    await click("NOT AT THIS TIME");
    const notReady = await state();
    if (notReady.calendar || !notReady.text.includes("We suggest you apply again") || notReady.calls.length !== 1 || notReady.calls[0].investment !== "not-ready") throw new Error("Unqualified route leaked the calendar or failed to send answers");
    if ([ready, failed, accepted, notReady].some(x => x.overflow || x.width > profile.width)) throw new Error("Responsive overflow");
    const shot = await command("Page.captureScreenshot", { format: "png", fromSurface: true });
    writeFileSync(`/home/ubuntu/nancynyc-funnel-${profile.name}-boundary.png`, Buffer.from(shot.data, "base64"));
    results.push({ profile: profile.name, failureStayedAtGate: !failed.calendar, fullPayloadCaptured: true, retryIdempotent: true, qualifiedCalendar: accepted.calendar, unqualifiedCalendar: notReady.calendar, noOverflow: true });
  }
  console.log(JSON.stringify(results, null, 2));
} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  chrome.kill("SIGTERM");
}
