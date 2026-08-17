# The system map (/docs/system-map)



One read, top to bottom: you talk to the system, the system remembers and acts, work flows back to you.

<Steps>
  <Step>
    <h4>
      You
    </h4>

    <p>
      <strong>Sergei — CEO / product owner</strong>
    </p>

    <p>
      Journals daily, approves plans, refines Linear issues. Says ~5 things: 

      <em>wrap up · grill me · research X · reviews · morning brief reads itself</em>

      .
    </p>

    <p>
      <small>via Cursor on Mac/PC · Tailscale · Telegram @persik_hermes_bot · Grokbot beside the desk</small>
    </p>
  </Step>

  <Step>
    <h4>
      Jackie-OS · the repo
    </h4>

    <p>
      <strong>Memory + playbooks, versioned in git</strong>
    </p>

    <ul>
      <li>
        <strong>Vault/</strong>

         — Obsidian second brain — journals, project notes, briefs, 

        `hot.md`

         session cache. Source of truth.
      </li>

      <li>
        <strong>System/skills/</strong>

         — Markdown playbooks agents follow — morning-brief, project-sync, wrap-up, research, coaching.
      </li>

      <li>
        <strong>System/{coo,capture,ops,…}</strong>

         — Bash/Python runners. Edited here, symlinked onto the VPS — never edited there.
      </li>
    </ul>

    <p>
      <small>via git push · autodeploy pulls every 2 min</small>
    </p>
  </Step>

  <Step>
    <h4>
      Hermes · always-on VPS
    </h4>

    <p>
      <strong>The 24/7 instance of the same agent</strong>
    </p>

    <p>
      <strong>Agent cron:</strong>

       07:00 sweep · 07:10 trade-digest · 07:30 morning-brief · hourly journal
    </p>

    <p>
      <strong>OS crontab:</strong>

       autodeploy */2m · merge-poll ~2h · healthcheck · degraded-brief · weekly intel + index
    </p>

    <p>
      <strong>LLM gateway</strong>

       (

      `hermes`

       CLI, subscription OAuth — no API billing): claude-fable-5 → claude-haiku-4.5 → gpt-5.6-terra
    </p>

    <p>
      <small>via Linear (needs-refinement → needs-approval → Todo → PR → Done)</small>
    </p>
  </Step>

  <Step>
    <h4>
      Desk
    </h4>

    <p>
      <strong>Cursor on the Tailscale mesh. Hermes is not a coding farm.</strong>
    </p>

    <ul>
      <li>
        <strong>Cursor</strong>

         — interactive coding, vault, ops. One window per repo.
      </li>

      <li>
        <strong>Grokbot</strong>

         — parallel chat. Not git or vault truth.
      </li>

      <li>
        <strong>Linear</strong>

         — backlog only. The Cyrus/Buzz/bb factory is retired — see 

        <a href="/jackie-os/docs/desk-journey">desk journey</a>

        .
      </li>
    </ul>

    <p>
      <small>via commits / PRs → merge-poll + project-sync write back</small>
    </p>
  </Step>

  <Step>
    <h4>
      Back to you
    </h4>

    <p>
      <strong>The vault stays current, you stay briefed</strong>
    </p>

    <p>
      Project 

      `## Status`

       \+ 

      `hot.md`

       refresh on every wrap-up and merge · 07:30 morning brief lands in Telegram with everything that changed.
    </p>
  </Step>
</Steps>

## The morning brief, step by step [#the-morning-brief-step-by-step]

```
git pull → telegram-sweep → trade-digest → project-sync → LLM brief → calendar + inbox → Telegram DM + HTML → commit + push
```

If the 07:30 brief fails, a degraded brief (vault + hot.md only) fires at 08:35 as backstop.

## Want more? [#want-more]

* **[Every cron with exact times →](/jackie-os/docs/vault-rhythm)**
* **[The words used above (Persik, hot.md, gateway) →](/jackie-os/docs/concepts)**
* **[Ecosystem context — the product repos around this →](/jackie-os/docs/architecture)**
