/* ─────────────────────────────────────────────
   qCode Apps — app.js
   Agentic / Terminal Dashboard Logic
   ───────────────────────────────────────────── */

'use strict';

// ── Icon & Badge maps ──────────────────────────────────────────────────────

const APP_ICONS = {
  'Lighthouse':     { icon: '🏠', label: 'HOME' },
  'Hermes':         { icon: '📩', label: 'MAIL' },
  'Aegis':          { icon: '🔐', label: 'SEC'  },
  'Agentic':        { icon: '🤖', label: 'AI'   },
  'SeerLink':       { icon: '📱', label: 'MOB'  },
  'qKiosk POS':       { icon: '🛒', label: 'BMS'  },
  'qDeskio':       { icon: '📋', label: 'PMS'  },
};

const SERVER_ICONS = {
  'Router':         { icon: '🌐', label: 'NET'  },
  'AdGuard':        { icon: '🛡️', label: 'DNS'  },
  'Mobility Print': { icon: '🖨️', label: 'PRNT' },
  'PCB Sentinel':   { icon: '🖥️', label: 'SYS'  },
  'Echo':   { icon: '🗃️', label: 'SYNC'  },
};

const TYPE_CONFIG = {
  app:          { iconBg: 'icon-bg-app',          badge: 'badge-app',          badgeLabel: 'APP',   defaultIcon: '🌐' },
  business:     { iconBg: 'icon-bg-business',     badge: 'badge-business',     badgeLabel: 'BIZ',   defaultIcon: '🏢' },
  server:       { iconBg: 'icon-bg-server',       badge: 'badge-server',       badgeLabel: 'SRV',   defaultIcon: '🖥️' },
  batch:        { iconBg: 'icon-bg-batch',        badge: 'badge-batch',        badgeLabel: 'BAT',   defaultIcon: '⚡' },
  link:         { iconBg: 'icon-bg-link',         badge: 'badge-link',         badgeLabel: 'URL',   defaultIcon: '🔗' },
  access:       { iconBg: 'icon-bg-access',       badge: 'badge-access',       badgeLabel: 'ACC',   defaultIcon: '⚙️' },
  localwebapp:  { iconBg: 'icon-bg-localwebapp',  badge: 'badge-localwebapp',  badgeLabel: 'LWA',   defaultIcon: '🖥️' },
  localhost:    { iconBg: 'icon-bg-localhost',    badge: 'badge-localhost',    badgeLabel: 'DEV',   defaultIcon: '💻' },
};

// ── Tab path map ───────────────────────────────────────────────────────────
const TAB_PATHS = {
  apps:         '~/apps',
  business:     '~/business',
  server:       '~/server',
  batch:        '~/scripts',
  links:        '~/links',
  access:       '~/access',
  localwebapps: '~/local-apps',
  localhosts:   '~/localhosts',
};

// ── State ─────────────────────────────────────────────────────────────────
let activeTab = 'apps';
let allCards  = [];   // { el, name, tab }

// ── DOM refs ──────────────────────────────────────────────────────────────
const searchEl      = document.getElementById('search');
const visibleCount  = document.getElementById('visible-count');
const tabPath       = document.getElementById('tab-path');
const emptyState    = document.getElementById('empty-state');
const emptyQuery    = document.getElementById('empty-query');
const footerTab     = document.getElementById('footer-tab');
const footerTime    = document.getElementById('footer-time');
const clockTime     = document.getElementById('clock-time');
const clockDate     = document.getElementById('clock-date');

// ── Clock ─────────────────────────────────────────────────────────────────
function updateClock() {
  const now  = new Date();
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const mons = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');

  clockTime.textContent = `${hh}:${mm}:${ss}`;
  clockDate.textContent = `${days[now.getDay()]} ${mons[now.getMonth()]} ${String(now.getDate()).padStart(2,'0')}`;
  footerTime.textContent = `${hh}:${mm}`;
}

updateClock();
setInterval(updateClock, 1000);

// ── Background Canvas (particle grid) ─────────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dots = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(W / 40);
    const rows = Math.ceil(H / 40);
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        dots.push({
          x: c * 40,
          y: r * 40,
          o: Math.random() * 0.5,
          s: Math.random() * 0.8 + 0.3,
          d: Math.random() < 0.5 ? 1 : -1,
          sp: Math.random() * 0.004 + 0.002,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      d.o += d.sp * d.d;
      if (d.o > 0.5 || d.o < 0) d.d *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,180,${d.o})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ── Tab switching ─────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const tab = this.dataset.tab;
    switchTab(tab);
  });
});

function switchTab(tab) {
  activeTab = tab;

  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
    b.setAttribute('aria-selected', b.dataset.tab === tab);
  });

  document.querySelectorAll('.tab-content').forEach(s => {
    s.classList.toggle('active', s.id === tab + '-tab');
  });

  tabPath.textContent  = TAB_PATHS[tab] || '~/apps';
  footerTab.textContent = tab;

  // Clear search
  if (searchEl.value) {
    searchEl.value = '';
    filterCards('');
  } else {
    updateCount();
  }

  emptyState.classList.add('hidden');
}

// ── Card builder ──────────────────────────────────────────────────────────
function buildCard(item, type, index) {
  const cfg   = TYPE_CONFIG[type] || TYPE_CONFIG.app;
  let icon    = cfg.defaultIcon;
  let badgeLabel = cfg.badgeLabel;

  // Resolve icon
  if (type === 'app' && APP_ICONS[item.name]) {
    const m = APP_ICONS[item.name];
    icon = m.icon;
    badgeLabel = m.label;
  } else if (type === 'server' && SERVER_ICONS[item.name]) {
    const m = SERVER_ICONS[item.name];
    icon = m.icon;
    badgeLabel = m.label;
  }

  // Detect [Remote] and [Seer] prefixes for access tab
  if (type === 'access') {
    if (item.name.startsWith('[Remote]')) { icon = '🖥️'; badgeLabel = 'RDC'; }
    else if (item.name.startsWith('[Seer]'))  { icon = '👁️'; badgeLabel = 'SEER'; }
    else if (item.name.startsWith('[Echo]'))  { icon = '🗃️'; badgeLabel = 'SYNC'; }
    else if (item.name === 'PCB Sentinel')    { icon = '🖥️'; badgeLabel = 'SYS'; }
    else if (item.name === 'Site Test')       { icon = '🧪'; badgeLabel = 'DEV'; }
  }

  // Detect port-based entries for localwebapps
  if (type === 'localwebapp') {
    icon = '🖥️';
    badgeLabel = 'LWA';
  }

  // Detect port-based entries for localhosts — show port as badge if parseable
  if (type === 'localhost') {
    icon = '💻';
    try {
      const port = new URL(item.url).port;
      if (port) badgeLabel = ':' + port;
    } catch (_) {}
  }

  if (type === 'business') {
    if (item.name === 'eBuild')     icon = '⚡';
    if (item.name === 'RigidTech') icon = '🔩';
  }

  const link   = item.url || item.file || '#';
  const card   = document.createElement('div');
  card.className  = 'card';
  card.dataset.name = item.name.toLowerCase();
  card.dataset.tab  = type;
  card.style.animationDelay = `${index * 0.04}s`;

  const anchor = document.createElement('a');
  anchor.href   = link;
  anchor.target = '_blank';
  anchor.rel    = 'noopener noreferrer';
  anchor.setAttribute('aria-label', item.name);

  if (type === 'batch') {
    anchor.setAttribute('download', '');
    anchor.removeAttribute('target');
  }

  // Display name — strip [prefix] for cleaner look
  const displayName = item.name
    .replace(/^\[Remote\]\s*/, '')
    .replace(/^\[Echo\]\s*/, '')
    .replace(/^\[Seer\]\s*/, '');

  anchor.innerHTML = `
    <div class="card-badge ${cfg.badge}">${badgeLabel}</div>
    <div class="card-icon-wrap ${cfg.iconBg}">${icon}</div>
    <h3>${displayName}</h3>
  `;

  card.appendChild(anchor);
  return card;
}

// ── Data loader ───────────────────────────────────────────────────────────
async function loadData(file, containerId, type) {
  try {
    const res  = await fetch(file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const container = document.getElementById(containerId);
    if (!container) return;

    data.forEach((item, i) => {
      const card = buildCard(item, type, i);
      container.appendChild(card);
      allCards.push({ el: card, name: item.name.toLowerCase(), tab: type });
    });

    updateCount();
  } catch (err) {
    console.warn(`[qCode] Failed to load ${file}:`, err);
  }
}

// ── Load all data ─────────────────────────────────────────────────────────
Promise.all([
  loadData('data/apps.json',          'apps-list',          'app'),
  loadData('data/business.json',      'business-list',      'business'),
  loadData('data/homeserver.json',    'server-list',        'server'),
  loadData('data/batchfiles.json',    'batch-list',         'batch'),
  loadData('data/links.json',         'links-list',         'link'),
  loadData('data/access.json',        'access-list',        'access'),
  loadData('data/localwebapps.json',  'localwebapps-list',  'localwebapp'),
  loadData('data/localhosts.json',    'localhosts-list',    'localhost'),
]).then(updateCount);

// ── Search ────────────────────────────────────────────────────────────────
searchEl.addEventListener('input', function () {
  filterCards(this.value.trim().toLowerCase());
});

function filterCards(query) {
  let anyVisible = false;

  if (!query) {
    // Show all — respect active tab only
    allCards.forEach(({ el }) => el.classList.remove('hidden'));
    emptyState.classList.add('hidden');
    updateCount();
    return;
  }

  // Global search across all tabs — show all tabs
  document.querySelectorAll('.tab-content').forEach(s => s.classList.add('active'));

  allCards.forEach(({ el, name }) => {
    const match = name.includes(query);
    el.classList.toggle('hidden', !match);
    if (match) anyVisible = true;
  });

  if (!anyVisible) {
    emptyState.classList.remove('hidden');
    emptyQuery.textContent = `"${query}"`;
  } else {
    emptyState.classList.add('hidden');
  }

  updateCount();
}

// ── Count update ──────────────────────────────────────────────────────────
function updateCount() {
  const query = searchEl.value.trim().toLowerCase();
  let count;

  if (query) {
    count = allCards.filter(({ el }) => !el.classList.contains('hidden')).length;
  } else {
    // Count cards in active tab
    const activeSection = document.getElementById(activeTab + '-tab');
    if (activeSection) {
      count = activeSection.querySelectorAll('.card:not(.hidden)').length;
    } else {
      count = 0;
    }
  }

  visibleCount.textContent = count;
}

// ── Keyboard shortcut: / focuses search ───────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchEl) {
    e.preventDefault();
    searchEl.focus();
    searchEl.select();
  }
  if (e.key === 'Escape') {
    searchEl.value = '';
    searchEl.blur();
    filterCards('');
    // Restore active tab view
    document.querySelectorAll('.tab-content').forEach(s => {
      s.classList.toggle('active', s.id === activeTab + '-tab');
    });
  }
});

// ── Initial count ─────────────────────────────────────────────────────────
updateCount();