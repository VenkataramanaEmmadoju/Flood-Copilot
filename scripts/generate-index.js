#!/usr/bin/env node
/**
 * generate-index.js  (ESM — root package.json has "type":"module")
 *
 * Run during the BUILD step to capture the SSR-rendered HTML for "/" from a
 * briefly-started nitro server and save it as .output/public/index.html.
 *
 * This lets production Express serve the app as a single-process SPA
 * (static assets + API + index.html fallback) without a separate nitro process.
 */

import { spawn } from "child_process";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE   = path.join(__dirname, "..");
const SERVER_INDEX = path.join(WORKSPACE, ".output", "server", "index.mjs");
const PUBLIC_DIR   = path.join(WORKSPACE, ".output", "public");
const INDEX_HTML   = path.join(PUBLIC_DIR, "index.html");
const NITRO_PORT   = 3099; // high port — avoids any Replit dev-preview conflict

if (!fs.existsSync(SERVER_INDEX)) {
  console.error("[generate-index] .output/server/index.mjs not found — skipping");
  process.exit(0);
}

console.log(`[generate-index] Starting nitro on port ${NITRO_PORT} to capture index.html…`);

const nitro = spawn("node", [SERVER_INDEX], {
  env: {
    ...process.env,
    NITRO_PORT: String(NITRO_PORT),
    NITRO_HOST: "127.0.0.1",
    HOST: "",
    PORT: String(NITRO_PORT), // prevent nitro from falling back to PORT=8080
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let nitroOutput = "";
nitro.stdout.on("data", (d) => { nitroOutput += d; process.stdout.write(d); });
nitro.stderr.on("data", (d) => { nitroOutput += d; process.stderr.write(d); });
nitro.on("error", (err) => {
  console.error("[generate-index] Failed to spawn nitro:", err.message);
  process.exit(0); // don't fail the build
});

function fetchHTML(maxAttempts = 25, intervalMs = 600) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      const req = http.get(`http://127.0.0.1:${NITRO_PORT}/`, (res) => {
        let body = "";
        res.on("data", (d) => (body += d.toString()));
        res.on("end", () => {
          if (res.statusCode === 200 && body.length > 200) {
            resolve(body);
          } else {
            retry();
          }
        });
      });
      req.on("error", retry);
      req.end();
    };
    const retry = () => {
      attempts++;
      if (attempts >= maxAttempts) reject(new Error("Nitro never became ready"));
      else setTimeout(check, intervalMs);
    };
    setTimeout(check, 1500); // initial wait for nitro to bind
  });
}

fetchHTML()
  .then((html) => {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.writeFileSync(INDEX_HTML, html);
    console.log(`[generate-index] ✓ Saved index.html (${html.length} bytes)`);
    nitro.kill("SIGTERM");
    setTimeout(() => process.exit(0), 300);
  })
  .catch((err) => {
    console.error("[generate-index] ✗ Could not capture HTML:", err.message);
    console.error("[generate-index] Nitro output:\n" + nitroOutput);
    nitro.kill("SIGTERM");
    // Exit 0 so the build doesn't fail entirely
    process.exit(0);
  });
