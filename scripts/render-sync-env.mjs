#!/usr/bin/env node
/**
 * Push the secret env vars from backend/.env up to the Render service,
 * so you never have to hand-type API keys into the Render dashboard.
 *
 * Usage:
 *   node scripts/render-sync-env.mjs            # sync env vars (Render auto-redeploys)
 *   node scripts/render-sync-env.mjs --deploy   # also trigger an explicit deploy
 *
 * Required (in process env OR in backend/.env):
 *   RENDER_API_KEY        - create at https://dashboard.render.com/u/settings#api-keys
 * Optional:
 *   RENDER_SERVICE_ID     - e.g. srv-xxxxxxxx (skips name lookup)
 *   RENDER_SERVICE_NAME   - defaults to "protien-managment-system"
 *
 * Nothing secret is committed: this reads your gitignored backend/.env.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dirname, '..', 'backend', '.env');
const API = 'https://api.render.com/v1';

// Keys that are tooling/runtime-managed and must NOT be uploaded.
const EXCLUDE = new Set([
  'RENDER_API_KEY', 'RENDER_SERVICE_ID', 'RENDER_SERVICE_NAME', 'PORT',
  'UPTIMEROBOT_API_KEY', 'HEALTH_URL',
]);

function parseEnv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

async function api(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) {
    throw new Error(`Render API ${method} ${path} -> ${res.status}: ${typeof json === 'string' ? json : JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  let fileEnv = {};
  try {
    fileEnv = parseEnv(readFileSync(ENV_PATH, 'utf8'));
  } catch {
    console.error(`✖ Could not read ${ENV_PATH}. Copy backend/.env.example to backend/.env and fill it in.`);
    process.exit(1);
  }

  const token = process.env.RENDER_API_KEY || fileEnv.RENDER_API_KEY;
  if (!token) {
    console.error('✖ RENDER_API_KEY not set. Add it to backend/.env or your shell environment.');
    console.error('  Create one at https://dashboard.render.com/u/settings#api-keys');
    process.exit(1);
  }

  let serviceId = process.env.RENDER_SERVICE_ID || fileEnv.RENDER_SERVICE_ID;
  const serviceName = process.env.RENDER_SERVICE_NAME || fileEnv.RENDER_SERVICE_NAME || 'Protien_Managment_System';

  if (!serviceId) {
    console.log(`• Looking up Render service by name: "${serviceName}"…`);
    const list = await api(`/services?name=${encodeURIComponent(serviceName)}&limit=20`, { token });
    const arr = Array.isArray(list) ? list : [];
    const match = arr.map((x) => x.service || x).find((s) => s && s.name === serviceName);
    if (!match) {
      console.error(`✖ No Render service named "${serviceName}". Set RENDER_SERVICE_ID in backend/.env.`);
      process.exit(1);
    }
    serviceId = match.id;
  }
  console.log(`• Target service: ${serviceId}`);

  const envVars = Object.entries(fileEnv)
    .filter(([k, v]) => !EXCLUDE.has(k) && v !== '' && !String(v).startsWith('CHANGE_ME'))
    .map(([key, value]) => ({ key, value }));

  if (envVars.length === 0) {
    console.error('✖ No usable env vars found in backend/.env (all empty or CHANGE_ME).');
    process.exit(1);
  }

  console.log(`• Syncing ${envVars.length} env vars: ${envVars.map((e) => e.key).join(', ')}`);
  await api(`/services/${serviceId}/env-vars`, { method: 'PUT', token, body: envVars });
  console.log('✓ Env vars updated on Render (this triggers an automatic redeploy).');

  if (process.argv.includes('--deploy')) {
    console.log('• Triggering an explicit deploy…');
    const dep = await api(`/services/${serviceId}/deploys`, { method: 'POST', token, body: { clearCache: 'do_not_clear' } });
    console.log(`✓ Deploy started: ${dep?.id || '(see dashboard)'}`);
  }
}

main().catch((err) => {
  console.error(`✖ ${err.message}`);
  process.exit(1);
});
