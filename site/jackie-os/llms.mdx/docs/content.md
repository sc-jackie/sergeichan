# Jackie-OS (/docs)



A second brain and an always-on AI agent, sharing one memory. The vault (Obsidian) is memory. Skills (markdown playbooks) are the contract. Hermes (a VPS agent) runs the loop 24/7. You stay CEO. This site explains the rest.

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
      file a Linear issue, then execute in Cursor (Hermes stays briefs/ops)
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

*The loop: every layer reads and writes the same second brain, so sessions pick up where you left off.*

## Four questions this site answers [#four-questions-this-site-answers]

### 1. What is this system? [#1-what-is-this-system]

Start with &#x2A;*[what Jackie-OS does](/jackie-os/docs/what-it-does)*&#x2A; — the plain-English walkthrough. Then the &#x2A;*[operator desk](/jackie-os/docs/desk)*&#x2A; (Cursor + Tailscale + Hermes + Grokbot), the &#x2A;*[system match](/jackie-os/docs/fleet)*&#x2A; (flow, tooling, models, personas), the &#x2A;*[system map](/jackie-os/docs/system-map)*&#x2A;, and the &#x2A;*[vocabulary](/jackie-os/docs/concepts)*&#x2A;. How the desk moved: &#x2A;*[desk journey](/jackie-os/docs/desk-journey)**.

### 2. What do I do? [#2-what-do-i-do]

The &#x2A;*[cheat-sheet](/jackie-os/docs/cheat-sheet)*&#x2A;: the \~5 things you say ("wrap up", "grill me", "research X", reviews) — everything else is automatic. Plus: closing a session, &#x2A;*[fixing the VPS](/jackie-os/docs/hermes-runbook)*&#x2A;, &#x2A;*[adding a project](/jackie-os/docs/add-a-project)**.

### 3. What runs by itself? [#3-what-runs-by-itself]

**[Every scheduled job on one page](/jackie-os/docs/vault-rhythm)*&#x2A; — the 07:00–07:30 morning stack, hourly journal, merge-poll, autodeploy — and &#x2A;*[which project syncs from where](/jackie-os/docs/project-registry)**.

### 4. What's the plan? [#4-whats-the-plan]

**[The roadmap](/jackie-os/docs/roadmap)*&#x2A; (active plans, shipped ledger), the &#x2A;*[ideas backlog](/jackie-os/docs/ideas-backlog)*&#x2A;, and the &#x2A;*[decisions log](/jackie-os/docs/decisions)** — the durable *why*.

***

**Looking for something specific?*&#x2A; Use search (top bar). Every skill, script, and doc is indexed. Or start from &#x2A;*[the master index](/jackie-os/docs/master-index)**.

**The one rule:** before building anything new, check the [master index](/jackie-os/docs/master-index) for prior art. When something ships, its doc updates in the same commit, so this site stays current.

*This site renders the repo's markdown directly (`docs-site/`, symlinked, no copies). Serve: `bash System/tools/docs-site.sh serve` → 127.0.0.1:8123.*
