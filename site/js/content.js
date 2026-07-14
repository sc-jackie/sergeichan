// content.js — render editorial content for Acts III–VI
// Imported by main.js; runs in both WebGL and fallback paths

import path from './data/path.js';
import capital from './data/capital.js';
import voice from './data/voice.js';
import about from './data/about.js';

// ============ ACT III: PATH — vertical editorial timeline ============
function renderPath() {
  const container = document.querySelector('#path .act-content');
  if (!container) return;

  const timeline = path.map((entry, idx) => {
    const card = document.createElement('div');
    card.className = 'path-card';

    card.innerHTML = `
      <div class="path-card-header">
        <span class="path-era">${entry.era}</span>
        <span class="path-role">${entry.role}</span>
        <span class="path-industry">${entry.industry}</span>
      </div>
      <div class="path-card-body">
        <div class="path-org">${entry.org}</div>
        <div class="path-industry">${entry.years} years</div>
        <p class="path-line">${entry.line}</p>
      </div>
    `;

    return card;
  });

  // Clear and append
  container.innerHTML = '';
  timeline.forEach((card, idx) => {
    container.appendChild(card);
    // Stagger reveal via IntersectionObserver for fallback
    if (idx === 0) card.classList.add('in-view');
  });

  // Fallback reveal: use IntersectionObserver for non-WebGL path rendering
  if (document.documentElement.classList.contains('fallback')) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.path-card').forEach(card => {
      observer.observe(card);
    });
  }
}

// ============ ACT IV: CAPITAL — three stream columns ============
function renderCapital() {
  const container = document.querySelector('#capital .act-content');
  if (!container) return;

  const streamsHtml = capital.streams.map(stream => {
    const countHtml = stream.count
      ? `<div class="capital-count">${stream.count}</div>`
      : '';

    const highlightsHtml = stream.highlights.map(h => `
      <div class="capital-highlight">
        <div class="capital-highlight-name">${h.name}</div>
        <div class="capital-highlight-meta">${h.year}</div>
        <div class="capital-highlight-note">${h.note}</div>
      </div>
    `).join('');

    const aggregateHtml = stream.aggregate
      ? `<div class="capital-stream-aggregate">${stream.aggregate}</div>`
      : '';

    return `
      <div class="capital-stream" style="--stream-color: ${stream.color}">
        <div class="capital-stream-header">
          <h3 class="capital-stream-name">${stream.name}</h3>
        </div>
        ${countHtml}
        ${aggregateHtml}
        <div class="capital-stream-thesis">${stream.thesis || ''}</div>
        <div class="capital-highlights">
          ${highlightsHtml}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `<div class="capital-streams">${streamsHtml}</div>`;
}

// ============ ACT V: VOICE — editorial rows ============
function renderVoice() {
  const container = document.querySelector('#voice .act-content');
  if (!container) return;

  const isEmpty = !voice || voice.length === 0;

  if (isEmpty) {
    container.innerHTML = '<div class="voice-empty"><p>Essays, talks, and mentions coming soon.</p></div>';
    return;
  }

  const rowsHtml = voice.map(item => {
    const liveClass = item.status === 'live' ? 'voice-row-live' : 'voice-row-draft';
    const statusLabel = item.status === 'live' ? '' : '· coming soon';

    const linkHtml = item.url && item.url !== '#'
      ? `<a href="${item.url}" class="voice-row-link" rel="external">read</a>`
      : '';

    return `
      <div class="voice-row ${liveClass}">
        <div class="voice-row-header">
          <h3 class="voice-row-title">${item.title}</h3>
          <div class="voice-row-meta">
            <span class="voice-type">${item.type}</span>
            <span class="voice-year">${item.year}</span>
            <span class="voice-source">${item.source}</span>
            <span class="voice-status">${statusLabel}</span>
          </div>
        </div>
        ${linkHtml}
      </div>
    `;
  }).join('');

  container.innerHTML = `<div class="voice-rows">${rowsHtml}</div>`;
}

// ============ ACT VI: SIGNAL — contact finale (privacy-first) ============
function renderSignal() {
  const container = document.querySelector('#signal .act-content');
  if (!container) return;

  // Privacy fix: no personal email link; only render if publicEmail is defined
  const publicEmail = about.publicEmail; // undefined by default

  const contactLinksHtml = `
    <div class="signal-links">
      <a href="https://github.com/sc-jackie" class="signal-link" rel="me">github</a>
      ${publicEmail ? `<a href="mailto:${publicEmail}" class="signal-link">email</a>` : ''}
    </div>
  `;

  const existingContent = container.querySelector('.signal-cta');
  if (existingContent) {
    // Replace the signal-cta with privacy-fixed version
    existingContent.innerHTML = contactLinksHtml;
  }
}

// ============ INIT — run on DOM ready ============
function initContent() {
  renderPath();
  renderCapital();
  renderVoice();
  renderSignal();

  console.log('[content] Rendered Acts III–VI');
}

// Run on module import (both WebGL and fallback paths)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContent);
} else {
  initContent();
}

export { renderPath, renderCapital, renderVoice, renderSignal };
