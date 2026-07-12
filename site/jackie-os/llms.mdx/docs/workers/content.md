# The workers (/docs/workers)



Sergei is PO/PM. **Cyrus** is the Linear coding worker, **Codex** is the CI review/build lane, **Hermes** is the general-purpose VPS agent (not a Linear worker), and interactive agents cover hands-on work. Per-repo routing: each repo's `AGENTS.md` § Choose the right worker.

## The dispatch pipeline [#the-dispatch-pipeline]

<Steps>
  <Step>
    <h4>
      Idea
    </h4>

    <p>
      bug or feature
    </p>
  </Step>

  <Step>
    <h4>
      Backlog
    </h4>

    <p>
      needs-refinement label
    </p>
  </Step>

  <Step>
    <h4>
      Refined
    </h4>

    <p>
      Cyrus Loop A writes the spec
    </p>
  </Step>

  <Step>
    <h4>
      Approval
    </h4>

    <p>
      Sergei reviews
    </p>
  </Step>

  <Step>
    <h4>
      Todo
    </h4>

    <p>
      ready to build
    </p>
  </Step>

  <Step>
    <h4>
      In Progress
    </h4>

    <p>
      Cyrus/Codex claim & work
    </p>
  </Step>

  <Step>
    <h4>
      In Review
    </h4>

    <p>
      Codex + CI review the PR
    </p>
  </Step>

  <Step>
    <h4>
      Done
    </h4>

    <p>
      merged, status synced
    </p>
  </Step>
</Steps>

**merge → merge-poll posts Linear status → project-sync updates vault Status + hot.md**

## Who's who [#whos-who]

<Cards>
  <Card title="Hermes" description="The general-purpose always-on agent: briefs, journal, sync, ops, research — and it can launch a supervised Claude Code session on request. Not the automatic Linear coding worker; it hosts Cyrus and the merge-poll automation." />

  <Card title="Cyrus (Claude Code)" description="The always-on Linear → Claude Code worker on the VPS. Takes eligible issues, works in an isolated worktree, opens PRs, reports progress back to the issue. Steer it via Linear agent-session events (assign/comment on the issue) — plain chat isn't enough." />

  <Card title="Codex (ChatGPT)" description="Runs in GitHub CI. Reviews PRs, runs the build lane, and can be delegated issues alongside Cyrus for parallel work on different areas." />

  <Card title="You + Claude Code" description="Interactive sessions (Claude Code on the Mac, Cursor). Refine specs, approve work in Linear, merge PRs, make calls about missing pieces — orchestrates the agents." />
</Cards>

## Where they work [#where-they-work]

Three code repositories share the Linear workflow contract (documented in each repo's `docs/linear-workflow.md`):

### Linear-tracked repos [#linear-tracked-repos]

* **B-Unit**
* **Newfin**
* **Rodyna**

Each carries a `docs/linear-workflow.md` sync contract — the label taxonomy, status machine, and agent dispatch rules (shared workspace-wide).

**Jackie-OS itself** stays on markdown plans deliberately — no Linear board, no agent dispatch. Sergei tracks it in the vault via `System/plans/`.

***

**Sync contract:** `~/dev/bunit/docs/linear-workflow.md` (rollout template for new repos)

**Roadmap:** [Roadmap](/jackie-os/docs/roadmap)

**Master index:** [Master index](/jackie-os/docs/master-index)
