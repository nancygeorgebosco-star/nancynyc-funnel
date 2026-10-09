import { spawn } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";

const pageUrl = "http://127.0.0.1:3001/?verify=three-plane-hero";
const sizes = [
  { name: "desktop", width: 1440, height: 1000, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
const expected = {
  headline: "YOU DID EVERYTHING RIGHT. SO WHY DOES IT STILL HURT?",
  subhead: "To everyone around you, you’re holding it together. Inside, you are carrying an exhaustion and quiet hopelessness that willpower and mindset tricks cannot fix. When your 3D reality, mental subconscious wiring, and 5D spiritual power pull in opposite directions, extra effort only compounds the pain. Nancy NYC conducts a private 3-week recalibration across all 3 planes—so the internal suffering ends and your life finally shifts.",
  rows: [
    ["[ ✗ WRONG TIME ]", "+ Right Action", "= Pain & Exhaustion"],
    ["[ ✓ RIGHT TIME ]", "+ Right Action", "= Effortless Relief & Scale"],
  ],
  map: ["WEEK 3 — 5D SPIRITUAL POWER & FLOW", "WEEK 2 — SUBCONSCIOUS MIND REPROGRAMMING", "WEEK 1 — 3D PHYSICAL & REAL-WORLD AUDIT"],
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const port = 9378;
const profileDir = "/tmp/nancynyc-three-plane-hero-cdp";
rmSync(profileDir, { force: true, recursive: true });
const chrome = spawn("/usr/bin/chromium", ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${profileDir}`, "about:blank"], { stdio: "ignore" });
let socket;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) { ready = true; break; } } catch { /* warming up */ }
    await wait(100);
  }
  if (!ready) throw new Error("Chromium failed to start");
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  const pending = new Map();
  let nextId = 0;
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!pending.has(message.id)) return;
    const { resolve, reject, method } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(`${method}: ${message.error.message}`)); else resolve(message.result);
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject, method });
    socket.send(JSON.stringify({ id, method, params }));
  });
  await command("Page.enable");
  await command("Runtime.enable");
  const results = [];
  for (const size of sizes) {
    await command("Emulation.setDeviceMetricsOverride", { width: size.width, height: size.height, deviceScaleFactor: 1, mobile: size.mobile });
    await command("Page.navigate", { url: pageUrl + `&viewport=${size.name}` });
    await wait(2300);
    const expression = `(() => {
      const normalize = text => (text || '').replace(/\\s+/g, ' ').trim();
      const hero = document.querySelector('section#top');
      const map = [...(hero?.querySelectorAll('h2') || [])].find(el => normalize(el.textContent).toUpperCase() === 'TRI-PLANAR EXECUTION MAP')?.parentElement?.parentElement?.parentElement;
      const title = hero?.querySelector('h1');
      const subhead = [...(hero?.querySelectorAll('p') || [])].find(el => normalize(el.textContent).startsWith('To everyone around you'));
      const rowElements = [...(hero?.querySelectorAll('.font-mono') || [])].filter(el => normalize(el.textContent).startsWith('['));
      const r = hero?.getBoundingClientRect();
      return {
        headline: normalize(title?.innerText),
        headlineGold: Boolean(title?.querySelector('.text-gold')),
        subhead: normalize(subhead?.textContent),
        rows: rowElements.map(el => normalize(el.textContent)),
        formulaDirectlyBelowSubhead: Boolean(subhead?.nextElementSibling?.contains(rowElements[0])),
        mapTitles: [...(map?.querySelectorAll('h3') || [])].map(el => normalize(el.textContent)),
        leftBeforeMap: Boolean(title && map && title.getBoundingClientRect().left < map.getBoundingClientRect().left),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        heroRect: r ? { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height } : null,
      };
    })()`;
    const inspected = await command("Runtime.evaluate", { expression, returnByValue: true });
    if (inspected.exceptionDetails) throw new Error(inspected.exceptionDetails.text);
    const value = inspected.result.value;
    if (!value?.heroRect || !Number.isFinite(value.heroRect.height)) {
      throw new Error(`${size.name}: hero did not render: ${JSON.stringify(value).slice(0, 600)}`);
    }
    const rowMatches = expected.rows.every((row, i) => row.every(part => value.rows[i]?.includes(part)));
    const valid = value.headline === expected.headline && value.headlineGold && value.subhead === expected.subhead && rowMatches && value.rows.length === 2 && value.formulaDirectlyBelowSubhead && JSON.stringify(value.mapTitles) === JSON.stringify(expected.map) && !value.horizontalOverflow && (size.mobile || value.leftBeforeMap);
    await command("Runtime.evaluate", { expression: "[...document.querySelectorAll('h2')].find(el => el.textContent?.toUpperCase().includes('TRI-PLANAR EXECUTION MAP'))?.scrollIntoView({ block: 'center' }); true", returnByValue: true });
    await wait(1200);
    if (size.mobile) {
      const mapViewport = await command("Page.captureScreenshot", { format: "png", fromSurface: true });
      writeFileSync("/home/ubuntu/nancynyc-three-plane-map-mobile-visible.png", Buffer.from(mapViewport.data, "base64"));
    }
    await command("Runtime.evaluate", { expression: "document.querySelector('header')?.style.setProperty('visibility','hidden','important'); true", returnByValue: true });
    await wait(650);
    const image = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true, clip: { ...value.heroRect, scale: 1 } });
    const path = `/home/ubuntu/nancynyc-three-plane-hero-${size.name}.png`;
    writeFileSync(path, Buffer.from(image.data, "base64"));
    results.push({ profile: size.name, valid, rowMatches, headlineExact: value.headline === expected.headline, subheadExact: value.subhead === expected.subhead, mapPreserved: JSON.stringify(value.mapTitles) === JSON.stringify(expected.map), horizontalOverflow: value.horizontalOverflow, screenshot: path });
  }
  console.log(JSON.stringify(results, null, 2));
  if (results.some(result => !result.valid)) process.exitCode = 1;
} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  chrome.kill("SIGTERM");
}
