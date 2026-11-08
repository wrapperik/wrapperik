// Generates the animated SVG cards used in the profile README.
// No dependencies: Node 20+ (global fetch). Run: GITHUB_TOKEN=... node scripts/generate.mjs
// Writes assets/generated/*.svg and assets/generated/data.json (the last good data,
// reused when a source cannot be read, e.g. a private repo with the default Actions token).

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'generated');
const LOGIN = 'wrapperik';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!TOKEN) throw new Error('Set GITHUB_TOKEN (or GH_TOKEN) to run this script.');

const NOW = new Date();
const YEAR = NOW.getUTCFullYear();
const YEAR_START = `${YEAR}-01-01T00:00:00Z`;

// Static facts that the API cannot tell us (from each project's README).
// Solid brand strips used as the project titles in the README.
const BRANDS = {
  koru: { bg: '#4A1D96', fg: '#FFFFFF', line: 'Desktop app · Windows and macOS · Team project · Mar–Nov 2026' },
  cardinal: { bg: '#C8432B', fg: '#FFFFFF', line: 'Mobile app · iOS and Android · Solo project · Aug–Nov 2026' },
  droplet: { bg: '#3B9DFF', fg: '#121212', line: 'Web app · Solo project · October 2026' },
};

const PROJECTS = [
  { key: 'koru', repo: 'koru', name: 'Koru', kind: 'Desktop LMS', team: 'Team of 4', tests: 216, mine: true },
  { key: 'cardinal', repo: 'cardinal', name: 'Cardinal', kind: 'Mobile revision app', team: 'Solo', tests: 390, testsPlus: true },
  { key: 'droplet', repo: 'droplet', name: 'Droplet', kind: 'AI web app', team: 'Solo', tests: 2716 },
];

const THEMES = {
  dark: {
    card: '#161b22', border: '#30363d', text: '#e6edf3', muted: '#8b949e', faint: '#21262d',
    accent: '#F2C21E', heat: ['#21262d', '#4d3f0c', '#8a6c10', '#c99d16', '#F2C21E'],
    koru: '#A57BE8', cardinal: '#E5694E', droplet: '#3B9DFF',
  },
  light: {
    card: '#ffffff', border: '#d0d7de', text: '#1f2328', muted: '#59636e', faint: '#eaeef2',
    accent: '#9A6700', heat: ['#ebedf0', '#fbe7a1', '#f2cb45', '#d9a10b', '#9a6700'],
    koru: '#5B2A9E', cardinal: '#B5371F', droplet: '#1F6FD1',
  },
};

// Montserrat (SIL OFL, see assets/fonts/OFL.txt), subset and embedded so it renders inside <img>.
const FONT = (await readFile(join(ROOT, 'assets', 'fonts', 'Montserrat-sub.woff2'))).toString('base64');
const FONT_FACE = `@font-face { font-family: 'Montserrat'; font-weight: 400 700; src: url(data:font/woff2;base64,${FONT}) format('woff2'); }`;
const SANS = "Montserrat, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = SANS;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const fmt = (n) => (n == null ? '–' : Number(n).toLocaleString('en-US'));
const IGNORE_LANGS = new Set(['Procfile', 'Dockerfile', 'Makefile', 'Batchfile', 'Shell']);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

async function gql(query, variables = {}) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-cards' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) console.warn('GraphQL warnings:', json.errors.map((e) => e.message).join('; '));
  return json.data;
}

// ---------- data ----------

async function fetchProfile() {
  const d = await gql(
    `query($login: String!, $from: DateTime!) {
      user(login: $login) {
        id avatarUrl(size: 240)
        year: contributionsCollection(from: $from) {
          totalCommitContributions totalPullRequestContributions restrictedContributionsCount
          contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
        }
        repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
          totalCount
          nodes { name isFork languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } } }
        }
      }
    }`,
    { login: LOGIN, from: YEAR_START },
  );
  const u = d?.user;
  if (!u) return null;
  const days = u.year.contributionCalendar.weeks.flatMap((w) => w.contributionDays);
  let streak = 0, best = 0, active = 0;
  for (const day of days) {
    if (day.contributionCount > 0) { active++; streak++; best = Math.max(best, streak); } else streak = 0;
  }
  const langs = {};
  const own = u.repositories.nodes.filter((r) => !r.isFork || PROJECTS.some((p) => p.repo === r.name));
  for (const r of own) for (const e of r.languages.edges) {
    if (IGNORE_LANGS.has(e.node.name)) continue;
    langs[e.node.name] ??= { size: 0, color: e.node.color || '#8b949e' };
    langs[e.node.name].size += e.size;
  }
  const avatar = await fetch(u.avatarUrl).then(async (r) => `data:${r.headers.get('content-type') || 'image/jpeg'};base64,${Buffer.from(await r.arrayBuffer()).toString('base64')}`);
  return {
    id: u.id, avatar,
    contributions: u.year.contributionCalendar.totalContributions,
    commits: u.year.totalCommitContributions + u.year.restrictedContributionsCount,
    prs: u.year.totalPullRequestContributions,
    repos: own.length,
    bestStreak: best, activeDays: active,
    weeks: u.year.contributionCalendar.weeks.map((w) => w.contributionDays.map((x) => [x.date, x.contributionCount])),
    languages: Object.entries(langs).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.size - a.size),
  };
}

async function fetchProject(p, userId) {
  let after = null, total = 0, branches = 0, dates = [];
  for (let page = 0; page < 30; page++) {
    const d = await gql(
      `query($owner: String!, $name: String!, $after: String, $since: GitTimestamp!) {
        repository(owner: $owner, name: $name) {
          refs(refPrefix: "refs/heads/") { totalCount }
          defaultBranchRef { target { ... on Commit {
            all: history(first: 1) { totalCount }
            year: history(first: 100, after: $after, since: $since) { pageInfo { hasNextPage endCursor } nodes { committedDate } }
          } } }
        }
      }`,
      { owner: LOGIN, name: p.repo, after, since: YEAR_START },
    );
    const repo = d?.repository;
    if (!repo) return null;
    const c = repo.defaultBranchRef.target;
    total = c.all.totalCount;
    dates.push(...c.year.nodes.map((n) => n.committedDate));
    branches = repo.refs.totalCount;
    if (!c.year.pageInfo.hasNextPage) break;
    after = c.year.pageInfo.endCursor;
  }
  let mine = null;
  if (p.mine && userId) {
    const d = await gql(
      `query($owner: String!, $name: String!, $id: ID!) { repository(owner: $owner, name: $name) {
        defaultBranchRef { target { ... on Commit { history(first: 1, author: { id: $id }) { totalCount } } } } } }`,
      { owner: LOGIN, name: p.repo, id: userId },
    );
    mine = d?.repository?.defaultBranchRef?.target?.history?.totalCount ?? null;
  }
  // commits per ISO week of the year
  const weekly = new Array(53).fill(0);
  const start = Date.UTC(YEAR, 0, 1);
  for (const iso of dates) weekly[Math.min(52, Math.floor((Date.parse(iso) - start) / (7 * 864e5)))]++;
  const sorted = dates.map((x) => new Date(x)).sort((a, b) => a - b);
  return {
    commits: total, mine, branches,
    first: sorted[0]?.toISOString() ?? null, last: sorted.at(-1)?.toISOString() ?? null,
    weekly: weekly.slice(0, Math.floor((NOW - start) / (7 * 864e5)) + 1),
  };
}

// ---------- svg helpers ----------

const reduceMotion = `@media (prefers-reduced-motion: reduce) { * { animation: none !important; } .rm-show { opacity: 1 !important; } .rm-hide { opacity: 0 !important; } }`;
const frame = (w, h, t, body, title, bare = false, stroke = null, sw = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>${FONT_FACE}</style>
${bare ? '' : `<rect x="${sw / 2}" y="${sw / 2}" width="${w - sw}" height="${h - sw}" rx="14" fill="${t.card}" stroke="${stroke ?? t.border}" stroke-width="${sw}"/>`}
${body}
</svg>
`;

// ---------- cards ----------

function hero(t, data) {
  const W = 840, H = 230, cx = 116, cy = 118, r = 70;
  const C = 2 * Math.PI * r, arc = C / 3 - 14;
  const ring = ['koru', 'cardinal', 'droplet'].map((k, i) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${t[k]}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${arc.toFixed(1)} ${(C - arc).toFixed(1)}" transform="rotate(${i * 120 - 90} ${cx} ${cy})"/>`).join('\n  ');
  const lines = [
    ['full-stack products, end to end.', t.accent],
    ['desktop apps on .NET and Electron.', t.koru],
    ['mobile apps with React Native.', t.cardinal],
    ['AI-native interfaces people trust.', t.droplet],
    ['accessible, considered UX.', t.accent],
  ];
  const per = 3, total = per * lines.length;
  // each variant repeats an invisible "I build " so the word starts exactly where the visible text ends
  const words = lines.map(([txt, col], i) =>
    `<text class="w ${i === 0 ? 'rm-show' : 'rm-hide'}" style="animation-delay:${i * per}s" x="222" y="142" font-family="${SANS}" font-size="22" font-weight="500" xml:space="preserve"><tspan fill-opacity="0">I build </tspan><tspan fill="${col}" font-weight="700">${esc(txt)}</tspan></text>`).join('\n  ');
  const body = `<style>
  .w { opacity: 0; animation: cycle ${total}s infinite; }
  @keyframes cycle { 0% { opacity: 0; transform: translateY(6px); } 3% { opacity: 1; transform: none; } ${((per / total) * 100 - 1).toFixed(1)}% { opacity: 1; transform: none; } ${((per / total) * 100 + 2).toFixed(1)}% { opacity: 0; transform: translateY(-6px); } 100% { opacity: 0; } }
  .spin { animation: spin 24s linear infinite; transform-origin: ${cx}px ${cy}px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .dot { animation: pulse 2.4s ease-in-out infinite; }
  @keyframes pulse { 50% { opacity: .35; } }
  ${reduceMotion}
</style>
<defs>
  <clipPath id="av"><circle cx="${cx}" cy="${cy}" r="${r - 9}"/></clipPath>
</defs>
<g class="spin">
  ${ring}
</g>
${data.avatar ? `<image href="${data.avatar}" x="${cx - r + 9}" y="${cy - r + 9}" width="${2 * (r - 9)}" height="${2 * (r - 9)}" clip-path="url(#av)" preserveAspectRatio="xMidYMid slice"/>` : ''}
<text x="222" y="66" font-family="${SANS}" font-size="12" font-weight="600" letter-spacing="3" fill="${t.muted}">HELLO, I'M</text>
<text x="220" y="108" font-family="${SANS}" font-size="40" font-weight="700" letter-spacing="-0.5" fill="${t.text}">Rikus Pretorius</text>
<text x="222" y="142" font-family="${SANS}" font-size="22" font-weight="500" fill="${t.text}" xml:space="preserve">I build </text>
  ${words}
<circle class="dot" cx="227" cy="183" r="4" fill="${t.accent}"/>
<text x="240" y="187.5" font-family="${SANS}" font-size="13" font-weight="500" fill="${t.muted}">Interactive Development + UX Design · Open Window · Class of ${YEAR}</text>`;
  return frame(W, H, t, body, 'Rikus Pretorius: full-stack developer and UX designer', true);
}

function stats(t, d) {
  const W = 840, H = 372;
  const tiles = [
    [fmt(d.contributions), `contributions in ${YEAR}`],
    [fmt(d.commits), 'commits'],
    [fmt(d.activeDays), 'active days'],
    [fmt(d.repos), 'public repos'],
  ];
  const tw = (W - 48 - 3 * 12) / 4;
  const tileSvg = tiles.map(([v, l], i) => {
    const x = 24 + i * (tw + 12);
    return `<g class="fade" style="animation-delay:${i * 90}ms">
  <rect x="${x}" y="66" width="${tw}" height="78" rx="10" fill="${t.faint}" fill-opacity=".55"/>
  <text x="${x + 16}" y="104" font-family="${SANS}" font-size="28" font-weight="700" fill="${i === 0 ? t.accent : t.text}">${v}</text>
  <text x="${x + 16}" y="128" font-family="${MONO}" font-size="10" font-weight="600" letter-spacing=".6" fill="${t.muted}">${esc(l.toUpperCase())}</text>
</g>`;
  }).join('\n');

  // heatmap of the calendar year
  const cell = 11, gap = 3, hx = 24 + 28, hy = 184;
  const max = Math.max(1, ...d.weeks.flat().map((x) => x[1]));
  const level = (n) => (n === 0 ? 0 : Math.min(4, 1 + Math.floor((n / max) * 3.999)));
  let cells = '', monthLabels = '', lastMonth = -1;
  d.weeks.forEach((week, wi) => {
    const x = hx + wi * (cell + gap);
    week.forEach(([date, n]) => {
      const dow = new Date(date + 'T00:00:00Z').getUTCDay();
      cells += `<rect class="cell" style="animation-delay:${wi * 14}ms" x="${x}" y="${hy + dow * (cell + gap)}" width="${cell}" height="${cell}" rx="2.5" fill="${t.heat[level(n)]}"><title>${date}: ${n}</title></rect>`;
      const m = new Date(date + 'T00:00:00Z').getUTCMonth();
      if (dow === 0 && m !== lastMonth && Number(date.slice(8)) <= 7) { lastMonth = m; monthLabels += `<text x="${x}" y="${hy - 8}" font-family="${MONO}" font-size="10" fill="${t.muted}">${MONTHS[m]}</text>`; }
    });
  });
  const dayLabels = [[1, 'Mon'], [3, 'Wed'], [5, 'Fri']].map(([i, s]) => `<text x="24" y="${hy + i * (cell + gap) + 9}" font-family="${MONO}" font-size="10" fill="${t.muted}">${s}</text>`).join('');
  const legend = t.heat.map((c, i) => `<rect x="${W - 24 - 34 - (5 - i) * 15}" y="${hy + 7 * (cell + gap) + 6}" width="11" height="11" rx="2.5" fill="${c}"/>`).join('');

  // languages
  const top = d.languages.slice(0, 6);
  const sum = top.reduce((a, l) => a + l.size, 0) || 1;
  const bx = 24, by = 320, bw = W - 48;
  let acc = 0, bar = '', key = '';
  top.forEach((l, i) => {
    const w = (l.size / sum) * bw;
    bar += `<rect x="${(bx + acc).toFixed(1)}" y="${by}" width="${Math.max(0, w - 2).toFixed(1)}" height="10" fill="${l.color}"/>`;
    acc += w;
    const kx = bx + (i % 6) * (bw / 6);
    key += `<circle cx="${kx + 5}" cy="${by + 30}" r="4.5" fill="${l.color}"/><text x="${kx + 15}" y="${by + 34}" font-family="${SANS}" font-size="12" fill="${t.text}">${esc(l.name)} <tspan fill="${t.muted}">${((l.size / sum) * 100).toFixed(1)}%</tspan></text>`;
  });

  const updated = `${NOW.getUTCDate()} ${MONTHS[NOW.getUTCMonth()]} ${YEAR}`;
  const body = `<style>
  .fade { animation: fade .6s ease-out both; }
  .cell { animation: fade .4s ease-out both; }
  .grow { animation: grow 1.1s cubic-bezier(.2,.8,.2,1) .3s both; transform-box: fill-box; transform-origin: left center; }
  @keyframes fade { from { opacity: 0; } }
  @keyframes grow { from { transform: scaleX(0); } }
  ${reduceMotion}
</style>
<text x="24" y="42" font-family="${SANS}" font-size="20" font-weight="700" fill="${t.text}">${YEAR} in numbers</text>
<text x="${W - 24}" y="42" text-anchor="end" font-family="${MONO}" font-size="11" fill="${t.muted}">updated ${updated} · GitHub Actions</text>
${tileSvg}
${monthLabels}${dayLabels}
<g>${cells}</g>
<text x="${W - 24}" y="${hy + 7 * (cell + gap) + 15}" text-anchor="end" font-family="${MONO}" font-size="10" fill="${t.muted}">more</text>
<text x="${W - 24 - 34 - 5 * 15 - 6}" y="${hy + 7 * (cell + gap) + 15}" text-anchor="end" font-family="${MONO}" font-size="10" fill="${t.muted}">less</text>${legend}
<text x="24" y="${by - 12}" font-family="${MONO}" font-size="11" letter-spacing=".5" fill="${t.muted}">LANGUAGES ACROSS PUBLIC REPOS</text>
<clipPath id="barclip"><rect x="${bx}" y="${by}" width="${bw}" height="10" rx="5"/></clipPath>
<g clip-path="url(#barclip)"><g class="grow">${bar}</g></g>
${key}`;
  return frame(W, H, t, body, `GitHub activity for ${YEAR}: ${fmt(d.contributions)} contributions, ${fmt(d.commits)} commits`);
}

function pulse(t, p, d) {
  const W = 840, H = 168, col = t[p.key];
  const period = d.first ? `${MONTHS[new Date(d.first).getUTCMonth()]} → ${MONTHS[new Date(d.last).getUTCMonth()]} ${YEAR}` : '';
  const metrics = [
    [fmt(d.commits), p.mine ? 'team commits' : 'commits'],
    ...(p.mine ? [[fmt(d.mine), 'by me']] : []),
    [fmt(d.branches), 'branches'],
    [fmt(p.tests) + (p.testsPlus ? '+' : ''), 'tests'],
  ];
  const mSvg = metrics.map(([v, l], i) => {
    const x = 32 + i * 104;
    return `<g class="fade" style="animation-delay:${i * 90}ms"><text x="${x}" y="98" font-family="${SANS}" font-size="27" font-weight="700" fill="${i === 0 ? col : t.text}">${v}</text>
<text x="${x}" y="120" font-family="${MONO}" font-size="9.5" font-weight="600" letter-spacing=".6" fill="${t.muted}">${esc(l.toUpperCase())}</text></g>`;
  }).join('\n');
  // sparkline: weekly commits this year
  const sx = 476, sw = W - 28 - sx, base = 120, sh = 56;
  const wk = d.weekly.length ? d.weekly : [0];
  const mx = Math.max(1, ...wk), bw = sw / wk.length;
  const bars = wk.map((n, i) => {
    const h = n ? Math.max(3, (n / mx) * sh) : 2;
    return `<rect class="bar" style="animation-delay:${300 + i * 12}ms" x="${(sx + i * bw).toFixed(1)}" y="${(base - h).toFixed(1)}" width="${Math.max(1.5, bw - 2).toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="${n ? col : t.faint}"><title>Week ${i + 1}: ${n} commits</title></rect>`;
  }).join('');
  const body = `<style>
  .fade { animation: fade .6s ease-out both; }
  .bar { animation: rise .7s cubic-bezier(.2,.8,.2,1) both; transform-box: fill-box; transform-origin: center bottom; }
  @keyframes fade { from { opacity: 0; } }
  @keyframes rise { from { transform: scaleY(0); } }
  ${reduceMotion}
</style>
<circle cx="38" cy="40" r="6" fill="${col}"/>
<text x="54" y="45" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="2" fill="${t.text}">${esc(p.name.toUpperCase())}</text>
<text x="${54 + p.name.length * 13 + 14}" y="45" font-family="${SANS}" font-size="13" fill="${t.muted}">${esc(p.kind)} · ${esc(p.team)}</text>
<text x="${W - 28}" y="45" text-anchor="end" font-family="${MONO}" font-size="12" fill="${t.muted}">${esc(period)}</text>
${mSvg}
${bars}
<line x1="${sx}" y1="${base + 0.5}" x2="${sx + sw}" y2="${base + 0.5}" stroke="${t.border}"/>
<text x="${sx}" y="142" font-family="${MONO}" font-size="10.5" fill="${t.muted}">COMMITS PER WEEK · ${YEAR}</text>`;
  return frame(W, H, t, body, `${p.name}: ${fmt(d.commits)} commits, ${fmt(d.branches)} branches, ${fmt(p.tests)} tests`, false, col, 5);
}

function title(p) {
  const W = 840, H = 76, b = BRANDS[p.key];
  const body = `<rect width="${W}" height="${H}" rx="14" fill="${b.bg}"/>
<text x="30" y="49" font-family="${SANS}" font-size="30" font-weight="700" letter-spacing="1" fill="${b.fg}">${esc(p.name.toUpperCase())}</text>
<text x="${W - 30}" y="44" text-anchor="end" font-family="${SANS}" font-size="13.5" font-weight="600" fill="${b.fg}" fill-opacity=".85">${esc(b.line)}</text>`;
  return frame(W, H, THEMES.dark, body, p.name, true);
}

// ---------- main ----------

await mkdir(OUT, { recursive: true });
const cachePath = join(OUT, 'data.json');
const cache = JSON.parse(await readFile(cachePath, 'utf8').catch(() => '{}'));

const profile = (await fetchProfile()) ?? cache.profile;
if (!profile) throw new Error('Could not read the GitHub profile and there is no cached data.');
const projects = {};
for (const p of PROJECTS) {
  const fresh = await fetchProject(p, profile.id).catch((e) => (console.warn(p.repo, e.message), null));
  if (!fresh) console.warn(`${p.repo}: not readable with this token, using cached data`);
  // keep the cached "by me" count if this token cannot attribute commits
  if (fresh && fresh.mine == null && cache.projects?.[p.key]?.mine != null) fresh.mine = cache.projects[p.key].mine;
  projects[p.key] = fresh ?? cache.projects?.[p.key];
}

for (const p of PROJECTS) await writeFile(join(OUT, `${p.key}-title.svg`), title(p));
for (const [mode, t] of Object.entries(THEMES)) {
  await writeFile(join(OUT, `hero-${mode}.svg`), hero(t, profile));
  await writeFile(join(OUT, `stats-${mode}.svg`), stats(t, profile));
  for (const p of PROJECTS) if (projects[p.key]) await writeFile(join(OUT, `${p.key}-${mode}.svg`), pulse(t, p, projects[p.key]));
}
const { avatar, ...profileData } = profile;
await writeFile(cachePath, JSON.stringify({ updated: NOW.toISOString(), profile: { ...profileData, avatar }, projects }, null, 2) + '\n');
console.log('Generated cards:', Object.keys(projects).join(', '), '·', profile.contributions, 'contributions');
