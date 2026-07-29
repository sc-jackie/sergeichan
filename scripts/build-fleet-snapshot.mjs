#!/usr/bin/env node

import { inflateSync } from "node:zlib";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = resolve(ROOT, "site/fleet/data.json");
const DASHBOARD_URL = (process.env.JACKIE_OS_DASHBOARD_URL || "http://127.0.0.1:9120").replace(/\/$/, "");

const FORBIDDEN_TEXT = [
  /\/home\//i,
  /\/Users\//i,
  /127\.0\.0\.1/i,
  /localhost/i,
  /:8\d{0,4}\b/,
  /\baleann(?:lab)?\b/i,
  /\bdraw\b/i,
  /192\.168\./,
  /167\.233\./,
];

const AGENTS = [
  {
    id: "fablio",
    name: "Fablio",
    role: "CEO / CPO / CTO orchestrator",
    lane: "orchestration",
    model: "Claude Opus 5",
    subscription: "Claude Code",
    blurb: "Turns intent into a sequenced plan, routes work by specialty, and holds the review bar before anything ships.",
  },
  {
    id: "cursorio",
    name: "Cursorio",
    role: "Fast, spec-driven implementer",
    lane: "implementation",
    model: "Cursor Auto",
    subscription: "Cursor",
    blurb: "Handles crisp, mechanical builds and refactors quickly, keeping scoped work moving through the queue.",
  },
  {
    id: "codexio",
    name: "Codexio",
    role: "Design lead and design engineer",
    lane: "design",
    model: "Claude Opus 5",
    subscription: "Claude Code",
    blurb: "Shapes interfaces, interaction, and visual systems, then builds and verifies the experience in the browser.",
  },
  {
    id: "cyrusio",
    name: "Cyrusio",
    role: "Delivery engineer, scoped issue to tested PR",
    lane: "delivery",
    model: "Cursor Auto",
    subscription: "Cursor",
    blurb: "Carries well-defined issues from implementation through tests and a review-ready pull request.",
  },
  {
    id: "marketio",
    name: "Marketio",
    role: "CMO — strategy, SEO, GTM briefs",
    lane: "marketing",
    model: "Cursor Auto",
    subscription: "Cursor",
    blurb: "Owns positioning, messaging, and SEO strategy; briefs the producer and reviews drafts before they reach the owner.",
  },
  {
    id: "scriptio",
    name: "Scriptio",
    role: "Content producer from briefs",
    lane: "content",
    model: "Cursor Auto",
    subscription: "Cursor",
    blurb: "Turns approved briefs into posts, scripts, page copy, and video drafts without inventing strategy.",
  },
  {
    id: "hermes",
    name: "Hermes",
    role: "Always-on operations relay",
    lane: "operations",
    model: "Cursor Agent",
    subscription: "Cursor",
    blurb: "Keeps scheduled rhythms, briefs, handoffs, and production operations moving between coding sessions.",
  },
];

const HOSTS = [
  { id: "macbook", label: "MacBook", role: "Operator client" },
  { id: "home-pc", label: "Home PC", role: "Local workstation · opportunistic agents" },
  { id: "hermes-vps", label: "Hetzner VPS", role: "Always-on hive · Hermes + Cyrus" },
];

const SUBSCRIPTIONS = [
  { id: "cursor", label: "Cursor", primary: true },
  { id: "claude-code", label: "Claude Code", primary: true },
  { id: "openai-plus", label: "OpenAI Plus", primary: false },
  { id: "gemini-free", label: "Gemini free", primary: false },
];

const REPOS = [
  { key: "sergeichan", label: "Personal Website", projects: ["Personal Website"] },
  { key: "jackie-os", label: "Jackie OS", projects: ["Jackie OS"] },
  { key: "newfin", label: "Newfin", projects: ["Newfin"] },
  { key: "bunit", label: "B-Unit", projects: ["B-Unit", "B-Unit — Content"] },
  { key: "rodyna-recipe-app", label: "Rodyna", projects: ["Rodyna"] },
];

const LOOPS = {
  delegation: [
    { id: "intent", label: "Sergei · intent", detail: "A goal becomes a scoped Linear issue.", agent: "fablio" },
    { id: "route", label: "Fablio · route", detail: "The work is decomposed and delegated by specialist lane.", agent: "fablio" },
    { id: "build", label: "Specialist · build", detail: "A focused worktree carries implementation and verification.", agent: "codexio" },
    { id: "review", label: "Team · review", detail: "A reviewed pull request is handed to Sergei to merge.", agent: "cyrusio" },
    { id: "deploy", label: "Hermes · relay", detail: "Production operations and the next handoff keep moving.", agent: "hermes" },
  ],
  compound: [
    { id: "work", label: "Work", detail: "A concrete issue produces an observable result." },
    { id: "learning", label: "Learning", detail: "The useful lesson is separated from session noise." },
    { id: "memory", label: "Memory", detail: "Durable context is recorded for the next agent session." },
    { id: "solution", label: "Solution", detail: "Reusable fixes become repository documentation." },
  ],
};

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function decodePng(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") throw new Error("Portrait is not a PNG");

  let offset = 8;
  let width;
  let height;
  let bitDepth;
  let colorType;
  let interlace;
  const chunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += length + 12;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      chunks.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
    throw new Error(`Unsupported PNG format: depth=${bitDepth}, colour=${colorType}, interlace=${interlace}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const raw = inflateSync(Buffer.concat(chunks));
  const pixels = Buffer.alloc(width * height * channels);
  let sourceOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[sourceOffset];
    sourceOffset += 1;
    for (let x = 0; x < stride; x += 1) {
      const value = raw[sourceOffset + x];
      const left = x >= channels ? pixels[y * stride + x - channels] : 0;
      const above = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upperLeft = y > 0 && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0;
      let reconstructed;
      if (filter === 0) reconstructed = value;
      else if (filter === 1) reconstructed = value + left;
      else if (filter === 2) reconstructed = value + above;
      else if (filter === 3) reconstructed = value + Math.floor((left + above) / 2);
      else if (filter === 4) reconstructed = value + paeth(left, above, upperLeft);
      else throw new Error(`Unsupported PNG filter: ${filter}`);
      pixels[y * stride + x] = reconstructed & 255;
    }
    sourceOffset += stride;
  }

  return { pixels, channels };
}

function sampleAccent(buffer) {
  const { pixels, channels } = decodePng(buffer);
  const histogram = new Map();

  for (let index = 0; index < pixels.length; index += channels) {
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    const alpha = channels === 4 ? pixels[index + 3] : 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (alpha < 230 || max - min < 42 || max < 55 || max > 235) continue;
    const key = `${r},${g},${b}`;
    histogram.set(key, (histogram.get(key) || 0) + 1);
  }

  const winner = [...histogram.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  if (!winner) throw new Error("Could not find a saturated accent colour in portrait");
  const rgb = winner[0].split(",").map(Number);
  return {
    rgb,
    hex: `#${rgb.map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`,
  };
}

async function getJson(pathname) {
  const response = await fetch(`${DASHBOARD_URL}${pathname}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`${pathname} returned HTTP ${response.status}`);
  return response.json();
}

function repoForIssue(issue) {
  const byProject = REPOS.find((repo) => repo.projects.includes(issue.project));
  if (byProject) return byProject.key;
  if (/fleet atlas|sergeichan|personal site/i.test(issue.title || "")) return "sergeichan";
  return null;
}

function agentForIssue(issue, sourceAgents) {
  const delegate = String(issue.delegate || "").toLowerCase();
  if (delegate === "cyrus") return "cyrusio";
  const direct = AGENTS.find((agent) => delegate.includes(agent.id));
  if (direct) return direct.id;
  const current = sourceAgents.find((agent) => agent.sessions?.issues?.includes(issue.id));
  return current?.name || null;
}

function assertPublicSafe(snapshot) {
  const serialized = JSON.stringify(snapshot);
  for (const pattern of FORBIDDEN_TEXT) {
    if (pattern.test(serialized)) throw new Error(`Public snapshot rejected by redaction rule ${pattern}`);
  }
}

async function main() {
  const refresh = process.argv.includes("--refresh");
  let capturedAt = process.env.FLEET_CAPTURED_AT || new Date().toISOString().slice(0, 10);
  let sourceAgents;
  let sourceIssues;
  let sourceSpend = { agents: {}, fleet: {}, bySubscriptionAgent: {} };

  if (refresh) {
    const [fleet, linear, spend] = await Promise.all([
      getJson("/api/fleet"),
      getJson("/api/linear"),
      getJson("/api/spend").catch(() => ({ agents: {}, fleet: {} })),
    ]);
    sourceAgents = Array.isArray(fleet.agents) ? fleet.agents : [];
    sourceIssues = Array.isArray(linear.issues) ? linear.issues : [];
    sourceSpend = spend && typeof spend === "object" ? spend : { agents: {}, fleet: {} };
  } else {
    const frozen = JSON.parse(await readFile(OUTPUT, "utf8"));
    capturedAt = process.env.FLEET_CAPTURED_AT || frozen.capturedAt;
    sourceAgents = frozen.agents.map((agent) => ({
      name: agent.id,
      sessions: {
        started: agent.stats.sessions,
        ok: agent.stats.activity,
        err: 0,
        issues: frozen.issues.filter((issue) => issue.agent === agent.id).map((issue) => issue.identifier),
      },
    }));
    sourceIssues = frozen.issues.map((issue) => ({
      id: issue.identifier,
      title: issue.title,
      state: issue.state,
      stateType: issue.stateType,
      delegate: issue.agent,
      project: REPOS.find((repo) => repo.key === issue.repo)?.projects[0],
      updatedAt: issue.updatedAt,
    }));
    sourceSpend = {
      agents: Object.fromEntries(
        (frozen.agents || []).map((agent) => [agent.id, { costUsd: agent.stats?.costUsd ?? null }]),
      ),
      fleet: {
        costUsd: frozen.totals?.estimatedCostUsd ?? null,
        costUsd7d: frozen.totals?.estimatedCostUsd7d ?? null,
      },
      bySubscriptionAgent: frozen.totals?.bySubscription || {},
    };
  }

  const agents = await Promise.all(AGENTS.map(async (agent) => {
    const portrait = `assets/${agent.id}.png`;
    const portraitOriginal = `assets/originals/${agent.id}.png`;
    const source = sourceAgents.find((candidate) => candidate.name === agent.id);
    const spend = sourceSpend.agents?.[agent.id] || {};
    const accent = sampleAccent(await readFile(resolve(ROOT, "site/fleet", portrait)));
    const cost = spend.costUsd;
    return {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      lane: agent.lane,
      model: agent.model,
      subscription: agent.subscription,
      blurb: agent.blurb,
      accent: accent.hex,
      accentRgb: accent.rgb,
      portrait,
      portraitOriginal,
      stats: {
        sessions: Number(source?.sessions?.started || 0),
        activity: Number(source?.sessions?.ok || 0) + Number(source?.sessions?.err || 0),
        costUsd: Number.isFinite(Number(cost)) ? Number(Number(cost).toFixed(2)) : null,
      },
    };
  }));

  const issues = sourceIssues
    .filter((issue) => !FORBIDDEN_TEXT.some((pattern) => pattern.test(issue.title || "")))
    .map((issue) => ({
      issue,
      repo: repoForIssue(issue),
      agent: agentForIssue(issue, sourceAgents),
    }))
    .filter(({ repo, agent }) => repo && agent)
    .map(({ issue, repo, agent }) => ({
      identifier: String(issue.id || issue.identifier),
      title: String(issue.title),
      state: String(issue.state),
      stateType: String(issue.stateType),
      agent,
      repo,
      updatedAt: String(issue.updatedAt).slice(0, 10),
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || b.identifier.localeCompare(a.identifier));

  const byState = {};
  for (const issue of issues) byState[issue.stateType] = (byState[issue.stateType] || 0) + 1;

  const bySub = sourceSpend.bySubscriptionAgent || {};
  const snapshot = {
    capturedAt,
    generatedBy: "scripts/build-fleet-snapshot.mjs",
    agents,
    hosts: HOSTS,
    subscriptions: SUBSCRIPTIONS,
    loops: LOOPS,
    issues,
    repos: REPOS.map(({ key, label }) => ({ key, label })),
    totals: {
      agents: agents.length,
      sessions: agents.reduce((sum, agent) => sum + agent.stats.sessions, 0),
      issues: issues.length,
      byState,
      estimatedCostUsd: Number.isFinite(Number(sourceSpend.fleet?.costUsd))
        ? Number(Number(sourceSpend.fleet.costUsd).toFixed(2))
        : null,
      estimatedCostUsd7d: Number.isFinite(Number(sourceSpend.fleet?.costUsd7d))
        ? Number(Number(sourceSpend.fleet.costUsd7d).toFixed(2))
        : null,
      bySubscription: {
        claude: Number(bySub.claude?.costUsd || 0),
        cursor: Number(bySub.cursor?.costUsd || 0),
        codex: Number(bySub.codex?.costUsd || 0),
        hermes: Number(bySub.hermes?.costUsd || 0),
      },
      costNote: "Estimated list-price token cost from AgentsView — not the subscription invoice.",
    },
  };

  assertPublicSafe(snapshot);
  await writeFile(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`${refresh ? "Refreshed" : "Rebuilt"} ${issues.length} scrubbed issues and ${agents.length} agents at ${OUTPUT}`);
}

main().catch((error) => {
  console.error(`Fleet snapshot failed: ${error.message}`);
  process.exitCode = 1;
});
