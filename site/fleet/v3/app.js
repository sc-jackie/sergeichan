(() => {
  'use strict';

  const state = {
    data: null,
    records: [],
    current: 0,
    suggestions: [],
    suggestionIndex: -1,
    reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const els = {
    form: document.querySelector('#query-form'),
    input: document.querySelector('#query'),
    suggestions: document.querySelector('#suggestions'),
    index: document.querySelector('#record-index'),
    record: document.querySelector('#record'),
    count: document.querySelector('#index-count'),
    date: document.querySelector('#captured-at'),
    status: document.querySelector('#system-status'),
    announcer: document.querySelector('#announcer'),
    help: document.querySelector('#help-dialog'),
    helpButton: document.querySelector('#help-button'),
    closeHelp: document.querySelector('#close-help')
  };

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);

  const recordLabel = record => record.kind === 'agent' ? record.agent.name : record.label;
  const hashFor = record => `#${record.id}`;
  const repoLabel = key => state.data.repos.find(repo => repo.key === key)?.label || key;
  const issuesFor = id => state.data.issues.filter(issue => issue.agent === id);

  function buildRecords(data) {
    const agents = data.agents.map((agent, index) => ({
      id: agent.id, kind: 'agent', label: agent.name, detail: agent.lane, agent, index
    }));
    return [
      { id: 'index', kind: 'overview', label: 'Archive overview', detail: 'Five-agent registry' },
      ...agents,
      { id: 'delegation', kind: 'loop', label: 'Delegation loop', detail: 'Intent → review', loop: 'delegation' },
      { id: 'compound', kind: 'loop', label: 'Compound loop', detail: 'Work → solution', loop: 'compound' },
      { id: 'issues', kind: 'issues', label: 'Assignment ledger', detail: `${data.issues.length} issue records` },
      { id: 'archive', kind: 'secret', label: 'Sealed note', detail: 'Archive memorandum' }
    ];
  }

  function renderIndex() {
    els.count.textContent = `${String(state.records.length).padStart(2, '0')} records`;
    els.index.innerHTML = state.records.map((record, index) => {
      const accent = record.kind === 'agent' ? record.agent.accent : '#2030d8';
      const type = record.kind === 'agent' ? 'PERS' : record.kind === 'loop' ? 'PROC' : 'FILE';
      return `<button class="record-button" type="button" data-record="${escapeHtml(record.id)}" style="--record-accent:${accent}">
        <span class="record-number">${String(index + 1).padStart(2, '0')}</span>
        <span><strong>${escapeHtml(recordLabel(record))}</strong><small>${escapeHtml(record.detail)}</small></span>
        <span class="record-type">${type}</span>
      </button>`;
    }).join('');
  }

  function agentRecord(record) {
    const agent = record.agent;
    const issues = issuesFor(agent.id);
    const activityLabel = agent.stats.activity === 1 ? 'event' : 'events';
    return `<div class="record-register"><span>Personnel record / ${String(record.index + 1).padStart(2, '0')}</span><span>Plate ${escapeHtml(agent.id.toUpperCase())}-${state.data.capturedAt.replaceAll('-', '')}</span></div>
      <div class="identity-grid">
        <figure class="portrait-plate">
          <div class="portrait-wrap"><img src="../${escapeHtml(agent.portrait)}" alt="Portrait of ${escapeHtml(agent.name)}" width="512" height="512"></div>
          <figcaption><span>Classified photograph</span><span>Public extract</span></figcaption>
        </figure>
        <div class="identity-copy">
          <p class="record-kicker">Active personnel</p>
          <h2 id="record-title">${escapeHtml(agent.name)}</h2>
          <p class="record-role">${escapeHtml(agent.role)} <span class="redaction" aria-hidden="true"></span></p>
          <div class="fact-grid">
            <div class="fact"><span>Assigned lane</span><strong>${escapeHtml(agent.lane)}</strong></div>
            <div class="fact"><span>Service model</span><strong>${escapeHtml(agent.model)}</strong></div>
            <div class="fact"><span>Sessions</span><strong>${agent.stats.sessions}</strong></div>
            <div class="fact"><span>Activity</span><strong>${agent.stats.activity} ${activityLabel}</strong></div>
          </div>
          <p class="blurb">${escapeHtml(agent.blurb)}</p>
        </div>
      </div>
      <section class="record-section" aria-labelledby="assignments-title">
        <h3 id="assignments-title">Recorded assignments · ${issues.length}</h3>
        ${issues.length ? `<ul class="issue-list">${issues.map(issueRow).join('')}</ul>` : '<p class="no-assignments">No issue closures were attached to this static snapshot.</p>'}
      </section>`;
  }

  function issueRow(issue) {
    return `<li class="issue-row">
      <button type="button" data-issue="${escapeHtml(issue.identifier)}">${escapeHtml(issue.identifier)}</button>
      <p>${escapeHtml(issue.title)}</p>
      <span class="state state-${escapeHtml(issue.stateType)}">${escapeHtml(issue.state)}</span>
    </li>`;
  }

  function overviewRecord() {
    const totals = state.data.totals;
    return `<div class="record-register"><span>Registry overview</span><span>Snapshot ${escapeHtml(state.data.capturedAt)}</span></div>
      <div class="loop-title">
        <p class="record-kicker">Public fleet extract</p>
        <h2 id="record-title">Five agents. One operating rhythm.</h2>
        <p class="loop-lede">This archive records who shapes the work, who builds it, who carries it through delivery, and who keeps the handoffs moving. Query any name or select a file from the register.</p>
      </div>
      <div class="overview-stats" aria-label="Snapshot totals">
        <div class="overview-stat"><strong>${totals.agents}</strong><span>agents</span></div>
        <div class="overview-stat"><strong>${totals.sessions}</strong><span>sessions</span></div>
        <div class="overview-stat"><strong>${totals.issues}</strong><span>issues</span></div>
      </div>
      <section class="record-section" aria-labelledby="roster-title"><h3 id="roster-title">Personnel roster</h3>
        <ul class="issue-list">${state.data.agents.map(agent => `<li class="issue-row"><button type="button" data-record="${escapeHtml(agent.id)}">${escapeHtml(agent.name)}</button><p>${escapeHtml(agent.role)}</p><span class="state">${escapeHtml(agent.lane)}</span></li>`).join('')}</ul>
      </section>`;
  }

  function loopRecord(record) {
    const delegation = record.loop === 'delegation';
    const steps = state.data.loops[record.loop];
    return `<div class="record-register"><span>Process record / ${delegation ? 'D-01' : 'C-02'}</span><span>Filed ${escapeHtml(state.data.capturedAt)}</span></div>
      <div class="loop-title">
        <p class="record-kicker">Operational doctrine</p>
        <h2 id="record-title">${delegation ? 'The delegation loop' : 'The compound loop'}</h2>
        <p class="loop-lede">${delegation ? 'Intent moves through a specialist chain without losing ownership: scope, route, build, review, relay.' : 'The result is not the end of the work. Useful learning is separated, recorded, and turned into reusable operating memory.'}</p>
      </div>
      <ol class="process-list">${steps.map(step => `<li class="process-step"><h3>${escapeHtml(step.label)}</h3><p>${escapeHtml(step.detail)}</p></li>`).join('')}</ol>`;
  }

  function issuesRecord() {
    const groups = Object.groupBy ? Object.groupBy(state.data.issues, issue => issue.stateType) : state.data.issues.reduce((acc, issue) => ((acc[issue.stateType] ||= []).push(issue), acc), {});
    return `<div class="record-register"><span>Assignment ledger</span><span>${state.data.issues.length} entries / static</span></div>
      <div class="loop-title"><p class="record-kicker">Issue register</p><h2 id="record-title">Work on record.</h2><p class="loop-lede">Linear identifiers, titles, repository labels, owners, and states captured on ${escapeHtml(state.data.capturedAt)}. This is a dated extract, not a live queue.</p></div>
      <div class="overview-stats" aria-label="Issue state totals">
        <div class="overview-stat"><strong>${state.data.totals.byState.completed}</strong><span>completed</span></div>
        <div class="overview-stat"><strong>${state.data.totals.byState.started}</strong><span>started</span></div>
        <div class="overview-stat"><strong>${(groups.unstarted || []).length}</strong><span>unstarted</span></div>
      </div>
      <section class="record-section" aria-labelledby="ledger-title"><h3 id="ledger-title">All assignments</h3><ul class="issue-list">${state.data.issues.map(issueRow).join('')}</ul></section>`;
  }

  function issueRecord(issue) {
    const agent = state.data.agents.find(item => item.id === issue.agent);
    return `<div class="record-register"><span>Assignment record / ${escapeHtml(issue.identifier)}</span><span>Updated ${escapeHtml(issue.updatedAt)}</span></div>
      <div class="loop-title"><p class="record-kicker">Linear issue extract</p><h2 id="record-title">${escapeHtml(issue.identifier)}</h2><p class="loop-lede">${escapeHtml(issue.title)}</p></div>
      <div class="fact-grid">
        <div class="fact"><span>Recorded state</span><strong>${escapeHtml(issue.state)}</strong></div>
        <div class="fact"><span>Assigned agent</span><strong>${escapeHtml(agent?.name || issue.agent)}</strong></div>
        <div class="fact"><span>Repository</span><strong>${escapeHtml(repoLabel(issue.repo))}</strong></div>
        <div class="fact"><span>Snapshot update</span><strong>${escapeHtml(issue.updatedAt)}</strong></div>
      </div>
      <section class="record-section"><h3>Cross-reference</h3><p class="blurb">Query <button class="inline-query" type="button" data-record="${escapeHtml(issue.agent)}">${escapeHtml(agent?.name || issue.agent)}</button> for the assigned personnel dossier, or <button class="inline-query" type="button" data-record="issues">issues</button> for the full ledger.</p></section>`;
  }

  function secretRecord() {
    return `<div class="record-register"><span>Memorandum / A-00</span><span>Unsealed for public release</span></div>
      <div class="sealed-note"><p class="record-kicker">Archive memorandum</p><h2 id="record-title">The terminal is not the system.</h2><p>This is a committed, dated artifact: five portraits, a public-safe work ledger, and two operating loops. It cannot rewrite a config, restart a service, or reach a private control plane.</p><p>The redaction bars are theater. Nothing secret entered the archive.</p><p class="meta-label">End note · query “index” to return</p></div>`;
  }

  function renderRecord(record, options = {}) {
    state.current = state.records.indexOf(record);
    const accent = record.kind === 'agent' ? record.agent.accent : record.kind === 'secret' ? '#8b243e' : '#2030d8';
    els.record.style.setProperty('--record-accent', accent);
    if (record.kind === 'agent') els.record.innerHTML = agentRecord(record);
    if (record.kind === 'overview') els.record.innerHTML = overviewRecord();
    if (record.kind === 'loop') els.record.innerHTML = loopRecord(record);
    if (record.kind === 'issues') els.record.innerHTML = issuesRecord();
    if (record.kind === 'secret') els.record.innerHTML = secretRecord();
    document.querySelectorAll('.record-button').forEach(button => {
      const active = button.dataset.record === record.id;
      if (active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    els.status.textContent = `Resolved: ${recordLabel(record)} · static archive`;
    els.announcer.textContent = `Record changed to ${recordLabel(record)}`;
    els.record.classList.remove('is-resolving');
    if (!state.reduceMotion) requestAnimationFrame(() => els.record.classList.add('is-resolving'));
    if (options.history !== false && location.hash !== hashFor(record)) history.pushState({ record: record.id }, '', hashFor(record));
    if (options.focus) els.record.focus({ preventScroll: true });
    if (options.scroll && innerWidth <= 760) els.record.scrollIntoView({ behavior: state.reduceMotion ? 'auto' : 'smooth', block: 'start' });
    closeSuggestions();
  }

  function renderIssue(issue, options = {}) {
    els.record.style.setProperty('--record-accent', '#8b243e');
    els.record.innerHTML = issueRecord(issue);
    document.querySelectorAll('.record-button').forEach(button => button.removeAttribute('aria-current'));
    els.status.textContent = `Resolved: ${issue.identifier} · assignment record`;
    els.announcer.textContent = `Record changed to issue ${issue.identifier}: ${issue.title}`;
    const hash = `#${issue.identifier.toLowerCase()}`;
    if (options.history !== false && location.hash !== hash) history.pushState({ issue: issue.identifier }, '', hash);
    if (options.focus) els.record.focus({ preventScroll: true });
    if (options.scroll && innerWidth <= 760) els.record.scrollIntoView({ behavior: state.reduceMotion ? 'auto' : 'smooth', block: 'start' });
    closeSuggestions();
  }

  function resolve(raw, options = {}) {
    const query = raw.trim().toLowerCase().replace(/^#/, '');
    if (!query) return;
    if (query === 'help' || query === '?') return openHelp();
    if (query === 'list') return renderRecord(state.records[0], options);
    if (query === 'next' || query === 'n') return step(1, options);
    if (query === 'prev' || query === 'previous' || query === 'p') return step(-1, options);
    if (query === 'random') return renderRecord(state.records[Math.floor(Math.random() * state.records.length)], options);
    const issue = state.data.issues.find(item => item.identifier.toLowerCase() === query);
    if (issue) return renderIssue(issue, options);
    const record = state.records.find(item => item.id === query || recordLabel(item).toLowerCase() === query);
    if (record) return renderRecord(record, options);
    const partial = state.records.find(item => item.id.startsWith(query) || recordLabel(item).toLowerCase().startsWith(query));
    if (partial) return renderRecord(partial, options);
    els.status.textContent = `No record matched “${raw.trim()}” · try help`;
    els.announcer.textContent = `No archive record matched ${raw.trim()}`;
    els.input.setAttribute('aria-invalid', 'true');
  }

  function step(amount, options = {}) {
    const next = (state.current + amount + state.records.length) % state.records.length;
    renderRecord(state.records[next], options);
  }

  function suggestionPool(query) {
    const commands = [
      { id: 'help', label: 'help', detail: 'Command index' }, { id: 'next', label: 'next', detail: 'Next record' },
      { id: 'prev', label: 'prev', detail: 'Previous record' }, { id: 'random', label: 'random', detail: 'Any record' }
    ];
    const issues = state.data.issues.map(issue => ({ id: issue.identifier, label: issue.identifier, detail: issue.title }));
    return [...state.records.map(record => ({ id: record.id, label: recordLabel(record), detail: record.detail })), ...commands, ...issues]
      .filter(item => !query || item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query) || item.detail.toLowerCase().includes(query))
      .slice(0, 7);
  }

  function updateSuggestions() {
    const query = els.input.value.trim().toLowerCase();
    state.suggestions = suggestionPool(query);
    state.suggestionIndex = -1;
    if (!query || !state.suggestions.length) return closeSuggestions();
    els.suggestions.innerHTML = state.suggestions.map((item, index) => `<li id="suggestion-${index}" role="option" data-suggestion="${escapeHtml(item.id)}" aria-selected="false"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span></li>`).join('');
    els.suggestions.hidden = false;
    els.input.setAttribute('aria-expanded', 'true');
    els.input.removeAttribute('aria-activedescendant');
  }

  function moveSuggestion(amount) {
    if (els.suggestions.hidden) updateSuggestions();
    if (!state.suggestions.length) return;
    state.suggestionIndex = (state.suggestionIndex + amount + state.suggestions.length) % state.suggestions.length;
    [...els.suggestions.children].forEach((item, index) => item.setAttribute('aria-selected', String(index === state.suggestionIndex)));
    els.input.setAttribute('aria-activedescendant', `suggestion-${state.suggestionIndex}`);
  }

  function closeSuggestions() {
    els.suggestions.hidden = true;
    state.suggestionIndex = -1;
    els.input.setAttribute('aria-expanded', 'false');
    els.input.removeAttribute('aria-activedescendant');
  }

  function openHelp() {
    closeSuggestions();
    els.helpButton.setAttribute('aria-expanded', 'true');
    els.help.showModal();
  }

  function resolveHash() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (!hash) return renderRecord(state.records[0], { history: false });
    const issue = state.data.issues.find(item => item.identifier.toLowerCase() === hash.toLowerCase());
    if (issue) return renderIssue(issue, { history: false });
    const record = state.records.find(item => item.id === hash.toLowerCase());
    renderRecord(record || state.records[0], { history: false });
  }

  function bindEvents() {
    els.form.addEventListener('submit', event => {
      event.preventDefault();
      els.input.removeAttribute('aria-invalid');
      const selected = state.suggestions[state.suggestionIndex];
      resolve(selected?.id || els.input.value, { focus: true, scroll: true });
      els.input.value = '';
    });
    els.input.addEventListener('input', () => { els.input.removeAttribute('aria-invalid'); updateSuggestions(); });
    els.input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); moveSuggestion(1); }
      if (event.key === 'ArrowUp') { event.preventDefault(); moveSuggestion(-1); }
      if (event.key === 'Escape') { closeSuggestions(); els.input.value = ''; }
    });
    els.suggestions.addEventListener('mousedown', event => event.preventDefault());
    els.suggestions.addEventListener('click', event => {
      const option = event.target.closest('[data-suggestion]');
      if (option) { resolve(option.dataset.suggestion, { focus: true, scroll: true }); els.input.value = ''; }
    });
    els.index.addEventListener('click', event => {
      const button = event.target.closest('[data-record]');
      if (button) resolve(button.dataset.record, { focus: true, scroll: true });
    });
    els.record.addEventListener('click', event => {
      const issue = event.target.closest('[data-issue]');
      const record = event.target.closest('[data-record]');
      if (issue) resolve(issue.dataset.issue, { focus: true });
      if (record) resolve(record.dataset.record, { focus: true });
    });
    document.addEventListener('keydown', event => {
      const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
      if (event.key === '/' && !typing && !els.help.open) { event.preventDefault(); els.input.focus(); }
      if (event.key === '?' && !typing && !els.help.open) { event.preventDefault(); openHelp(); }
      if (!typing && !els.help.open && ['j', 'J', 'ArrowDown'].includes(event.key)) { event.preventDefault(); step(1, { focus: true }); }
      if (!typing && !els.help.open && ['k', 'K', 'ArrowUp'].includes(event.key)) { event.preventDefault(); step(-1, { focus: true }); }
      if (!typing && !els.help.open && event.key === 'Home') { event.preventDefault(); renderRecord(state.records[0], { focus: true }); }
      if (!typing && !els.help.open && event.key === 'End') { event.preventDefault(); renderRecord(state.records.at(-1), { focus: true }); }
    });
    els.helpButton.addEventListener('click', openHelp);
    els.closeHelp.addEventListener('click', () => els.help.close());
    els.help.addEventListener('close', () => els.helpButton.setAttribute('aria-expanded', 'false'));
    els.help.addEventListener('click', event => { if (event.target === els.help) els.help.close(); });
    addEventListener('hashchange', resolveHash);
    addEventListener('popstate', resolveHash);
  }

  async function init() {
    try {
      const response = await fetch('../data.json');
      if (!response.ok) throw new Error(`Archive returned ${response.status}`);
      state.data = await response.json();
      state.records = buildRecords(state.data);
      els.date.textContent = state.data.capturedAt;
      renderIndex();
      bindEvents();
      resolveHash();
    } catch (error) {
      els.status.textContent = 'Archive unavailable · serve the site directory over HTTP';
      els.record.innerHTML = `<div class="sealed-note"><p class="record-kicker">Archive error</p><h2 id="record-title">The static extract could not be read.</h2><p>Confirm that the committed Fleet Atlas directory is being served from its site root, then reload this record.</p></div>`;
      console.error(error);
    }
  }

  init();
})();
