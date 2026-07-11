#!/usr/bin/env node
/*
 * flux-generate.js — Black Forest Labs (FLUX) image generator for WorkoutAssist.
 *
 * Reads the exercise prompt pack (app/src/data/prompts/googleFlowExercisePromptPack.ts),
 * submits the selected prompt(s) to the FLUX REST API, polls until ready, and
 * downloads the resulting PNG(s) to an output folder.
 *
 * API flow (per docs.bfl.ai): POST https://api.bfl.ai/v1/{model} with an
 * `x-key` header → { id, polling_url } → GET polling_url until status "Ready"
 * → image URL at result.sample (expires ~10 min, so we download immediately).
 *
 * Usage:
 *   BFL_API_KEY=xxxx node scripts/flux-generate.js --exercise barbell-squat --assets hero
 *   node scripts/flux-generate.js --exercise barbell-squat --assets hero,muscleCloseup --dry-run
 *   node scripts/flux-generate.js --list
 *
 * Flags:
 *   --exercise <slug|id|name>   Which exercise (substring match). Default: barbell-squat
 *   --assets <a,b,c>            Any of: hero, storyboard, muscleCloseup. Default: hero
 *   --out <dir>                 Output directory. Default: ./flux-output
 *   --model <name>             FLUX model. Default: env BFL_MODEL or flux-pro-1.1
 *   --width <px> --height <px>  Image size (multiples of 32). Default: 832 x 1440 (9:16)
 *   --limit <n>                 Max images to generate this run.
 *   --dry-run                   Print the plan + estimated cost; do NOT call the API.
 *   --list                      List available exercises and exit.
 *
 * Env:
 *   BFL_API_KEY            (required unless --dry-run/--list)
 *   BFL_MODEL             (optional, default flux-pro-1.1)
 *   BFL_PRICE_PER_IMAGE   (optional, for the cost estimate only; default 0.05)
 */

const fs = require('fs');
const path = require('path');

// Load repo-root .env (gitignored) so the API key never has to live in the
// shell or the chat. Dependency-free; only sets keys not already in the env.
function loadDotEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && val && process.env[key] === undefined) process.env[key] = val;
  }
}
loadDotEnv();

const { buildPrompt } = require('./buildFluxPrompt');

const PROMPT_PACK = path.join(__dirname, '..', 'app', 'src', 'data', 'prompts', 'googleFlowExercisePromptPack.ts');
const API_BASE = 'https://api.bfl.ai/v1';
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 180000;

const ASSET_MAP = {
  hero: { promptKey: 'heroPrompt', fileKey: 'hero' },
  storyboard: { promptKey: 'storyboardPrompt', fileKey: 'storyboard' },
  muscleCloseup: { promptKey: 'muscleCloseupPrompt', fileKey: 'muscleCloseup' },
};

// ---- CLI parsing -----------------------------------------------------------

function parseArgs(argv) {
  const args = { assets: 'hero', exercise: 'barbell-squat', out: './flux-output' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--list') args.list = true;
    else if (a === '--builder') args.builder = true;
    else if (a === '--all') args.all = true;
    else if (a.startsWith('--')) args[a.slice(2)] = argv[++i];
  }
  return args;
}

// ---- Prompt pack loader ----------------------------------------------------
// The pack is a .ts file; we extract the GOOGLE_FLOW_EXERCISE_PROMPTS array
// literal with a string-aware bracket matcher and JSON.parse it (entries are
// plain JSON — double-quoted keys/values with standard escapes).

function loadPrompts() {
  const src = fs.readFileSync(PROMPT_PACK, 'utf8');
  const marker = 'GOOGLE_FLOW_EXERCISE_PROMPTS';
  const mi = src.indexOf(marker);
  if (mi === -1) throw new Error(`Could not find ${marker} in ${PROMPT_PACK}`);
  const start = src.indexOf('[', mi);
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) { end = i; break; }
  }
  if (end === -1) throw new Error('Could not parse the prompt array (unbalanced brackets)');
  return JSON.parse(src.slice(start, end + 1));
}

function findExercise(prompts, query) {
  const q = query.toLowerCase();
  // Prefer an exact id/slug/name match before falling back to substring,
  // so e.g. "deadlift" resolves to Deadlift, not "romanian-deadlift-rdl".
  return (
    prompts.find(p => p.id.toLowerCase() === q || p.slug.toLowerCase() === q || p.name.toLowerCase() === q) ||
    prompts.find(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
  );
}

// ---- FLUX API --------------------------------------------------------------

async function submit({ apiKey, model, prompt, width, height, format = 'png' }) {
  const res = await fetch(`${API_BASE}/${model}`, {
    method: 'POST',
    headers: { 'x-key': apiKey, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ prompt, width, height, output_format: format, safety_tolerance: 6 }),
  });
  if (!res.ok) throw new Error(`Submit failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  if (!data.polling_url) throw new Error(`No polling_url in response: ${JSON.stringify(data)}`);
  return data;
}

async function pollResult({ apiKey, pollingUrl }) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const res = await fetch(pollingUrl, { headers: { 'x-key': apiKey, accept: 'application/json' } });
    if (!res.ok) throw new Error(`Poll failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    if (data.status === 'Ready') {
      const url = data.result && data.result.sample;
      if (!url) throw new Error(`Ready but no result.sample: ${JSON.stringify(data)}`);
      return url;
    }
    if (data.status && !['Pending', 'Request Accepted', 'Queued'].includes(data.status)) {
      throw new Error(`Generation ${data.status}: ${JSON.stringify(data.result || data)}`);
    }
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error('Timed out waiting for the image to be ready');
}

async function download(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

// ---- Main ------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv);
  const prompts = loadPrompts();

  if (args.list) {
    console.log(`\n${prompts.length} exercises in the prompt pack:\n`);
    for (const p of prompts) {
      console.log(`  ${p.id.padEnd(6)} ${p.status.padEnd(12)} ${p.slug.padEnd(28)} ${p.name}`);
    }
    console.log('\nPick one with --exercise <slug|id>.\n');
    return;
  }

  const model = args.model || process.env.BFL_MODEL || 'flux-pro-1.1';
  const width = parseInt(args.width || '832', 10);
  const height = parseInt(args.height || '1440', 10);
  const pricePerImage = parseFloat(process.env.BFL_PRICE_PER_IMAGE || '0.05');
  const outDir = path.resolve(args.out);

  const ext = ['jpg', 'jpeg'].includes((args.format || 'png').toLowerCase()) ? 'jpg' : 'png';
  const outputFormat = ext === 'jpg' ? 'jpeg' : 'png';

  // Resolve target exercise(s). --all batches every exercise via the builder.
  let targets;
  if (args.all) {
    if (!args.builder) throw new Error('--all requires --builder (batch generates hero images from the builder).');
    targets = prompts;
  } else {
    const ex = findExercise(prompts, args.exercise);
    if (!ex) throw new Error(`No exercise matched "${args.exercise}". Try --list.`);
    targets = [ex];
  }

  // Build generation jobs. --builder constructs the prompt from fields; a
  // --prompt-file overrides for single-exercise iteration; otherwise use the
  // pack's stored per-asset prompts.
  const promptFile = args['prompt-file'];
  const jobs = [];
  for (const ex of targets) {
    if (args.builder) {
      jobs.push({ label: ex.id, prompt: buildPrompt(ex), outFile: `${ex.id}.${ext}` });
    } else if (promptFile) {
      const tag = args.tag || 'v2';
      jobs.push({ label: tag, prompt: fs.readFileSync(path.resolve(promptFile), 'utf8').trim(), outFile: `${ex.slug}_${tag}.${ext}` });
    } else {
      let assets = args.assets.split(',').map(s => s.trim()).filter(Boolean);
      assets = assets.filter(a => ASSET_MAP[a] || console.warn(`  (ignoring unknown asset "${a}")`));
      if (args.limit) assets = assets.slice(0, parseInt(args.limit, 10));
      if (assets.length === 0) throw new Error('No valid assets requested (hero, storyboard, muscleCloseup).');
      for (const a of assets) {
        jobs.push({ label: `${ex.id}:${a}`, prompt: ex[ASSET_MAP[a].promptKey], outFile: ex.suggestedFiles[ASSET_MAP[a].fileKey].replace(/\.png$/, `.${ext}`) });
      }
    }
  }

  console.log(`\nTargets  : ${targets.length === 1 ? `${targets[0].name} (${targets[0].id})` : `${targets.length} exercises (--all)`}`);
  console.log(`Model    : ${model}`);
  console.log(`Size     : ${width} x ${height} (${ext})`);
  console.log(`Jobs     : ${jobs.length}`);
  console.log(`Out dir  : ${outDir}`);
  console.log(`Est. cost: ~$${(jobs.length * pricePerImage).toFixed(2)} (${jobs.length} img x ~$${pricePerImage}/img — verify at bfl.ai/pricing)\n`);

  if (args.dryRun) {
    console.log('--- DRY RUN (no API calls) ---\n');
    for (const j of jobs) {
      console.log(`# ${j.label} -> ${j.outFile}`);
      console.log(`${j.prompt.slice(0, 320)}...\n`);
    }
    console.log('Re-run without --dry-run (and with BFL_API_KEY set) to generate.\n');
    return;
  }

  const apiKey = process.env.BFL_API_KEY;
  if (!apiKey) throw new Error('BFL_API_KEY is not set. Export it, or use --dry-run to preview.');

  fs.mkdirSync(outDir, { recursive: true });
  let totalCost = 0;

  const MAX_ATTEMPTS = 2; // one retry — covers transient errors and moderation false-positives
  const failures = [];
  let i = 0;
  for (const j of jobs) {
    i++;
    const dest = path.join(outDir, j.outFile);
    const t0 = Date.now();
    process.stdout.write(`[${i}/${jobs.length}] ${j.label}... `);
    let ok = false;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS && !ok; attempt++) {
      try {
        const { polling_url } = await submit({ apiKey, model, prompt: j.prompt, width, height, format: outputFormat });
        const imageUrl = await pollResult({ apiKey, pollingUrl: polling_url });
        const bytes = await download(imageUrl, dest);
        totalCost += pricePerImage;
        ok = true;
        console.log(`done ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${j.outFile} (${(bytes / 1024).toFixed(0)} KB)`);
      } catch (err) {
        if (attempt < MAX_ATTEMPTS) process.stdout.write(`retry... `);
        else { console.log(`FAILED: ${err.message.slice(0, 80)}`); failures.push(j.label); }
      }
    }
  }
  if (failures.length) console.log(`\n${failures.length} failed: ${failures.join(', ')}`);

  console.log(`\nFinished. Approx spend this run: ~$${totalCost.toFixed(2)}.`);
  console.log('Images are for review only — not yet wired into the app catalog.\n');
}

main().catch(err => { console.error(`\nError: ${err.message}\n`); process.exit(1); });
