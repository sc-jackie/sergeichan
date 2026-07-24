# The workers (/docs/workers)



Sergei is CEO. **Four Cyrus-instance agents on the Hermes VPS** are the Linear workers: **Fablio**, **Cursorio**, **Codexio**, and **Cyrusio**. **Hermes** is the general-purpose VPS agent (not a Linear worker). Legacy **Codex** (ChatGPT in GitHub CI) still exists. Interactive sessions on the Mac cover hands-on work. Per-repo routing: each repo's `AGENTS.md` § Choose the right worker.

## The dispatch pipeline [#the-dispatch-pipeline]

<Steps>
  <Step>
    <h4>
      Issue
    </h4>

    <p>
      bug, feature, or goal in Linear
    </p>
  </Step>

  <Step>
    <h4>
      Repo label
    </h4>

    <p>
      Newfin · Rodyna · Draw · Jackie-OS · Website · AI-OS (bunit: curriculum/bim)
    </p>
  </Step>

  <Step>
    <h4>
      Mode label
    </h4>

    <p>
      optional: Plan · Scope · Bug · Debug · Build · Feature
    </p>
  </Step>

  <Step>
    <h4>
      Delegate
    </h4>

    <p>
      assign to the agent whose lane it is
    </p>
  </Step>

  <Step>
    <h4>
      Webhook
    </h4>

    <p>
      session starts in under 1s
    </p>
  </Step>

  <Step>
    <h4>
      Worktree
    </h4>

    <p>
      isolated clone / worktree on the VPS
    </p>
  </Step>

  <Step>
    <h4>
      PR
    </h4>

    <p>
      tested PR with 

      <code>Fixes <ISSUE-ID></code>

       → In Review
    </p>
  </Step>

  <Step>
    <h4>
      Merge
    </h4>

    <p>
      human merges — agents never merge or push default branches
    </p>
  </Step>
</Steps>

**merge → merge-poll posts Linear status → project-sync updates vault Status + hot.md**

Giving Fablio a goal issue with `Plan` = full orchestration: he splits it, delegates by lane, reviews results against acceptance criteria, iterates.

## Who's who [#whos-who]

<Cards>
  <Card title="Fablio (Claude Fable 5)" description="CEO/CPO/CTO orchestrator. Plans, decides, reviews, delegates. Plan/Scope labels trigger PM modes: decomposes goals into sub-issues with acceptance criteria and routes them to the team." />

  <Card title="Cursorio (Cursor)" description="Fast implementer — clear specs, refactors, quick fixes. Build/Feature and Bug/Debug modes." />

  <Card title="Codexio (Codex GPT-5.6 Sol)" description="Design lead — UI/UX, design systems, visual polish; greenfield vs product-design modes; design skill pack." />

  <Card title="Cyrusio (Claude Sonnet 5)" description="Delivery engineer — well-scoped issues end-to-end to a tested PR. Honest reporting. Formerly “Cyrus Builder”." />

  <Card title="Hermes" description="The general-purpose always-on agent: briefs, journal, sync, ops, research. Not a Linear worker — it hosts the four Cyrus instances and the merge-poll automation." />

  <Card title="Codex (ChatGPT, legacy CI)" description="Still runs in GitHub CI for PR review / build lane. Separate from Codexio, the design-lead Linear worker." />

  <Card title="You + interactive agents" description="Hands-on sessions (Claude Code / Cursor / Codex on the Mac). Approve work in Linear, merge PRs, make calls about missing pieces." />
</Cards>

## Team-member rails [#team-member-rails]

Shipped 2026-07-23 (Buzz-inspired — agents as first-class teammates):

* **Persistent memory** — each agent owns `System/agents/&#60;agent>/MEMORY.md` (cross-repo knowledge: gotchas, preferences, mistakes); `System/agents/team.md` is the shared team log (conventions, incidents, decisions — append-only, signed). Agents read both at session start and append learnings during work; a VPS cron (`agent-memory-sync`, every 2h) commits them to the repo authored as the agent, so they're human-readable and editable in git. Repo-specific fixes still go to each repo's `docs/solutions/`.
* **Per-agent git identity** — commits are authored `Fablio` / `Cursorio` / `Codexio` / `Cyrusio` via systemd env drop-ins. PRs still open via the shared `sc-jackie` account; Linear identity is already per-agent.
* **Telegram rail** — all four agents can ping Sergei for blocking decisions via `hermes send`, stating a recommendation and proceeding with reversible parts.
* **Mid-run steering** — commenting on a Linear issue while an agent works injects a course correction into the live session; an @mention can spawn a fresh session.
* **Merge record** — Fablio writes the *why* of every review/merge decision as an issue comment; the issue is the permanent record of why the code exists.

## Where they work [#where-they-work]

Linear-tracked product repos share the workflow contract (documented in each repo's `docs/linear-workflow.md` where present):

### Linear-tracked repos [#linear-tracked-repos]

* **B-Unit** (routing labels: `curriculum` / `bim`)
* **Newfin**
* **Rodyna**
* **Draw**
* **Jackie-OS**
* **Personal Website** (`Website`)
* **AI-OS**

Each carries the shared workspace label taxonomy and agent dispatch rules.

***

**Sync contract:** `~/dev/bunit/docs/linear-workflow.md` (rollout template for new repos)

**Canonical roster:** Jackie-OS `Vault/Agent-Team.md` + Linear doc *Agent team — roster, routing, and workflow*

**Roadmap:** [Roadmap](/jackie-os/docs/roadmap)

**Master index:** [Master index](/jackie-os/docs/master-index)
