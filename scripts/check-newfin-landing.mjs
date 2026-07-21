import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "site/newfin/index.html"), "utf8");

const href = html.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1];
if (!href) throw new Error("Newfin landing has no local stylesheet");

const deployedPath = new URL(href, "https://sergeichan.vercel.app/newfin").pathname;
if (!existsSync(join(root, "site", deployedPath))) {
  throw new Error(`Stylesheet resolves to missing production asset: ${deployedPath}`);
}

for (const id of ["why", "how", "surfaces", "use-cases", "for-whom", "architecture"]) {
  if (!html.includes(`id="${id}"`)) {
    throw new Error(`Newfin landing is missing #${id}`);
  }
}

for (const asset of [
  "assets/home.png",
  "assets/home-hero.png",
  "assets/portfolio.png",
  "assets/cashflow.png",
  "assets/trading.png",
]) {
  if (!html.includes(`/newfin/${asset}`)) {
    throw new Error(`Newfin landing is missing screenshot reference: /newfin/${asset}`);
  }
  if (!existsSync(join(root, "site/newfin", asset))) {
    throw new Error(`Newfin landing screenshot file missing: site/newfin/${asset}`);
  }
}

console.log(`Newfin landing contract OK: ${deployedPath}`);
