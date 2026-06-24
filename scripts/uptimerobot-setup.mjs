#!/usr/bin/env node
/**
 * Create (or reuse) an UptimeRobot monitor that pings the backend's /health
 * endpoint every 5 minutes, so the Render free-tier service never spins down
 * (no cold starts → the app stays fast).
 *
 * Usage:
 *   node scripts/uptimerobot-setup.mjs
 *
 * Required (in process env OR in backend/.env):
 *   UPTIMEROBOT_API_KEY   - a Main API key from https://uptimerobot.com (My Settings → API)
 * Optional:
 *   HEALTH_URL            - defaults to https://protien-managment-system.onrender.com/health
 *
 * Nothing secret is committed: this reads your gitignored backend/.env.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dirname, '..', 'backend', '.env');
const API = 'https://api.uptimerobot.com/v2';
const DEFAULT_URL = 'https://protien-managment-system.onrender.com/health';

function parseEnv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    out[line.slice(0, eq).trim()] = val;
  }
  return out;
}

async function form(path, params) {
  const body = new URLSearchParams({ format: 'json', ...params });
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
    body,
  });
  const json = await res.json();
  if (json.stat !== 'ok') {
    throw new Error(`UptimeRobot ${path}: ${json.error?.message || JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  let fileEnv = {};
  try { fileEnv = parseEnv(readFileSync(ENV_PATH, 'utf8')); } catch {}

  const apiKey = process.env.UPTIMEROBOT_API_KEY || fileEnv.UPTIMEROBOT_API_KEY;
  if (!apiKey || apiKey.startsWith('CHANGE_ME')) {
    console.error('✖ UPTIMEROBOT_API_KEY not set. Add a Main API key to backend/.env.');
    console.error('  Get one at https://uptimerobot.com → My Settings → API → Main API Key');
    process.exit(1);
  }
  const url = process.env.HEALTH_URL || fileEnv.HEALTH_URL || DEFAULT_URL;

  // Skip if a monitor for this URL already exists.
  const existing = await form('/getMonitors', { api_key: apiKey, search: url });
  if ((existing.monitors || []).some((m) => m.url === url)) {
    console.log(`✓ Monitor already exists for ${url} — nothing to do.`);
    return;
  }

  console.log(`• Creating UptimeRobot monitor for ${url} (every 5 min)…`);
  const created = await form('/newMonitor', {
    api_key: apiKey,
    friendly_name: 'ProteinPro backend (keep-warm)',
    url,
    type: '1',          // HTTP(s)
    interval: '300',    // 5 minutes
  });
  console.log(`✓ Monitor created (id ${created.monitor?.id}). The backend will now stay warm.`);
}

main().catch((err) => {
  console.error(`✖ ${err.message}`);
  process.exit(1);
});
