# Jackie-OS (/docs)



A second brain plus an always-on AI agent, wired together. The vault (Obsidian) is memory; skills (markdown playbooks) are the contract; Hermes (a VPS agent) runs the loop 24/7. You stay CEO; this site explains the rest.

<Steps>
  <Step>
    <h4>
      Capture
    </h4>

    <p>
      DM a thought, link, or meeting — it files itself into the vault
    </p>
  </Step>

  <Step>
    <h4>
      Brief
    </h4>

    <p>
      07:30 morning brief: what changed, top 3, calendar
    </p>
  </Step>

  <Step>
    <h4>
      Build
    </h4>

    <p>
      workers (Cyrus, Codex) take Linear issues → PRs
    </p>
  </Step>

  <Step>
    <h4>
      Sync
    </h4>

    <p>
      merges write back to project Status + hot.md
    </p>
  </Step>

  <Step>
    <h4>
      Compound
    </h4>

    <p>
      learnings, decisions, reviews accrete in the vault
    </p>
  </Step>
</Steps>

*The loop — every layer reads and writes the same second brain, so nothing starts cold.*

## Four questions this site answers [#four-questions-this-site-answers]

### 1. What is this system? [#1-what-is-this-system]

Start with &#x2A;*[what Jackie-OS does](/jackie-os/docs/what-it-does)*&#x2A; — the plain-English walkthrough. Then the &#x2A;*[system map](/jackie-os/docs/system-map)*&#x2A; (one page, top to bottom: you → vault/skills → Hermes → workers → back to you) and the &#x2A;*[vocabulary](/jackie-os/docs/concepts)**.

### 2. What do I do? [#2-what-do-i-do]

The &#x2A;*[cheat-sheet](/jackie-os/docs/cheat-sheet)*&#x2A;: the \~5 things you say ("wrap up", "grill me", "research X", reviews) — everything else is automatic. Plus: closing a session, &#x2A;*[fixing the VPS](/jackie-os/docs/hermes-runbook)*&#x2A;, &#x2A;*[adding a project](/jackie-os/docs/add-a-project)**.

### 3. What runs by itself? [#3-what-runs-by-itself]

**[Every scheduled job on one page](/jackie-os/docs/vault-rhythm)*&#x2A; — the 07:00–07:30 morning stack, hourly journal, merge-poll, autodeploy — and &#x2A;*[which project syncs from where](/jackie-os/docs/project-registry)**.

### 4. What's the plan? [#4-whats-the-plan]

**[The roadmap](/jackie-os/docs/roadmap)*&#x2A; (active plans, shipped ledger), the &#x2A;*[ideas backlog](/jackie-os/docs/ideas-backlog)*&#x2A;, and the &#x2A;*[decisions log](/jackie-os/docs/decisions)** — the durable *why*.

***

**Looking for something specific?*&#x2A; Use search (top bar) — every skill, script, and doc is indexed. Or start from &#x2A;*[the master index](/jackie-os/docs/master-index)**.

**The one rule:** before building anything new, check the [master index](/jackie-os/docs/master-index) for prior art. When something ships, its doc updates in the same commit — so this site is always current.

*This site renders the repo's markdown directly (`docs-site/`, symlinked — no copies). Serve: `bash System/tools/docs-site.sh serve` → 127.0.0.1:8123.*
