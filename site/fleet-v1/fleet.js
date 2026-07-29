const state = { data: null, activeAgent: null };

const $ = (selector) => document.querySelector(selector);
const agentById = (id) => state.data.agents.find((agent) => agent.id === id);

function channelStyle(agent) {
  return `--channel:${agent?.accent || '#d7a84f'}`;
}

function renderRoster() {
  $('#agent-roster').innerHTML = state.data.agents.map((agent, index) => `
    <button class="agent-card${agent.id === state.activeAgent ? ' is-active' : ''}" type="button"
      data-agent="${agent.id}" aria-pressed="${agent.id === state.activeAgent}" style="${channelStyle(agent)}"
      aria-label="Inspect ${agent.name}, ${agent.role}">
      <img src="/fleet/${agent.portrait}" alt="" loading="eager">
      <span class="agent-card__meta"><b>${agent.name}</b><small>${agent.lane}</small></span>
      <i class="agent-card__bar" aria-hidden="true"></i>
    </button>`).join('');

  document.querySelectorAll('.agent-card').forEach((button) => {
    button.addEventListener('click', () => selectAgent(button.dataset.agent));
    button.addEventListener('mouseenter', () => previewAgent(button.dataset.agent));
    button.addEventListener('focus', () => previewAgent(button.dataset.agent));
  });
}

function previewAgent(id) {
  const agent = agentById(id);
  const index = state.data.agents.indexOf(agent);
  const detail = $('#agent-detail');
  detail.style.setProperty('--channel', agent.accent);
  $('#detail-image').src = `/fleet/${agent.portrait}`;
  $('#detail-image').alt = `${agent.name}, ${agent.role}`;
  $('#detail-lane').textContent = agent.lane;
  $('#detail-model').textContent = agent.model;
  $('#detail-name').textContent = agent.name;
  $('#detail-role').textContent = agent.role;
  $('#detail-blurb').textContent = agent.blurb;
  $('#detail-sessions').textContent = String(agent.stats.sessions).padStart(2, '0');
  $('#detail-activity').textContent = String(agent.stats.activity).padStart(2, '0');
  $('#detail-cost').textContent = agent.stats.costUsd == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(agent.stats.costUsd);
  $('#detail-sub').textContent = agent.subscription || '—';
  $('#detail-index').textContent = `${String(index + 1).padStart(2, '0')} / ${String(state.data.agents.length).padStart(2, '0')}`;
  $('#radar-readout').textContent = `${agent.name.toUpperCase()} / ${agent.lane.toUpperCase()}`;
}

function selectAgent(id) {
  state.activeAgent = state.activeAgent === id ? null : id;
  renderRoster();
  renderIssues();
  const active = state.activeAgent ? agentById(state.activeAgent) : null;
  if (active) previewAgent(active.id);
  $('#clear-filter').hidden = !active;
  $('#load-status').textContent = active ? `Issue ledger filtered to ${active.name}.` : 'Issue ledger showing all agents.';
  document.querySelector(`[data-agent="${id}"]`)?.focus();
}

function renderLoops() {
  $('#delegation-loop').innerHTML = state.data.loops.delegation.map((step, index) => {
    const agent = agentById(step.agent);
    return `<li style="${channelStyle(agent)}"><b>${String(index + 1).padStart(2, '0')}</b><strong>${step.label}</strong><p>${step.detail}</p></li>`;
  }).join('');
  $('#compound-loop').innerHTML = state.data.loops.compound.map((step, index) =>
    `<li><b>${String(index + 1).padStart(2, '0')} / ${step.label}</b><p>${step.detail}</p></li>`).join('');
}

function renderIssues() {
  const issues = state.activeAgent ? state.data.issues.filter((issue) => issue.agent === state.activeAgent) : state.data.issues;
  $('#issue-ledger').innerHTML = issues.length ? issues.map((issue) => {
    const agent = agentById(issue.agent);
    return `<article class="issue" style="${channelStyle(agent)}" title="${issue.title}">
      <span class="issue__id">${issue.identifier}</span><span class="issue__title">${issue.title}</span><span class="issue__state">${issue.state}</span>
    </article>`;
  }).join('') : '<p class="empty">No issue records on this channel.</p>';
  $('#record-count').textContent = `${String(issues.length).padStart(2, '0')} RECORDS`;
}

function renderTotals() {
  const totals = state.data.totals;
  const values = { agents: totals.agents, sessions: totals.sessions, issues: totals.issues, completed: totals.byState.completed };
  Object.entries(values).forEach(([key, value]) => {
    const node = document.querySelector(`[data-counter="${key}"]`);
    if (node) node.textContent = String(value).padStart(2, '0');
  });
  const labels = [['completed', 'Complete'], ['started', 'Active'], ['unstarted', 'Queued'], ['canceled', 'Canceled']];
  $('#state-rail').innerHTML = labels.map(([key, label]) => `<span>${label}<b>${String(totals.byState[key] || 0).padStart(2, '0')}</b></span>`).join('');
  const costNode = document.querySelector('[data-counter="cost7d"]');
  if (costNode && totals.estimatedCostUsd7d != null) {
    costNode.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totals.estimatedCostUsd7d);
  }
}

async function init() {
  try {
    const response = await fetch('/fleet/data.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Snapshot returned ${response.status}`);
    state.data = await response.json();
    $('#captured-at').dateTime = state.data.capturedAt;
    $('#captured-at').textContent = state.data.capturedAt;
    state.activeAgent = null;
    renderRoster();
    previewAgent(state.data.agents[0].id);
    renderLoops();
    renderIssues();
    renderTotals();
    $('#clear-filter').hidden = true;
    $('#clear-filter').addEventListener('click', () => selectAgent(state.activeAgent));
    $('#load-status').textContent = `Fleet snapshot captured ${state.data.capturedAt} loaded. Five agent channels available.`;
  } catch (error) {
    $('#load-status').textContent = 'Fleet snapshot could not be loaded.';
    $('#agent-roster').innerHTML = '<p class="empty">Snapshot unavailable. Serve this directory over HTTP to read the committed record.<br><button type="button" id="retry-load">Try again</button></p>';
    $('#detail-name').textContent = 'Snapshot unavailable';
    $('#detail-role').textContent = 'The committed record could not be read.';
    $('#detail-blurb').textContent = 'Retry after confirming this directory is being served over HTTP.';
    $('#delegation-loop').innerHTML = '<li class="empty">Routing record unavailable.</li>';
    $('#compound-loop').innerHTML = '<li class="empty">Memory record unavailable.</li>';
    $('#issue-ledger').innerHTML = '<p class="empty">Issue records unavailable.</p>';
    document.querySelector('#retry-load')?.addEventListener('click', init);
  } finally {
    window.setTimeout(() => document.documentElement.classList.remove('is-booting'), 1350);
  }
}

init();
