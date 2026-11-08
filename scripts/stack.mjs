// Builds the tech stack icon rows in assets/stack (one SVG per category, light and dark).
// Icons come from skillicons.dev; logos it does not have are drawn as matching tiles from
// Simple Icons. Run once when the stack changes: node scripts/stack.mjs

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'stack');

// [skillicons id] or { si: simple-icons slug, color, light?: colour on the light tile, name }
const ROWS = {
  languages: ['ts', 'js', 'cs', 'html', 'css'],
  frontend: ['react', 'vite', 'tailwind', 'materialui', { si: 'zod', color: '#3E67B1', name: 'Zod' }, { si: 'framer', color: '#FFFFFF', light: '#000000', name: 'Framer Motion' }],
  apps: ['electron', { si: 'expo', color: '#FFFFFF', light: '#000020', name: 'Expo' }, 'react'],
  backend: ['dotnet', 'nodejs', 'postgres', 'supabase', 'firebase'],
  ai: [{ si: 'googlegemini', color: '#8E75B2', name: 'Google Gemini' }, { si: 'deepseek', color: '#4D6BFE', name: 'DeepSeek' }, { si: 'claude', color: '#D97757', name: 'Claude' }],
  devops: ['docker', 'vercel', 'githubactions', 'jest', 'vitest', 'git', 'github'],
  design: ['figma'],
};
const NAMES = {
  ts: 'TypeScript', js: 'JavaScript', cs: 'C#', html: 'HTML', css: 'CSS', react: 'React', vite: 'Vite',
  tailwind: 'Tailwind CSS', materialui: 'Material UI', electron: 'Electron', dotnet: '.NET', nodejs: 'Node.js',
  postgres: 'PostgreSQL', supabase: 'Supabase', firebase: 'Firebase', docker: 'Docker', vercel: 'Vercel',
  githubactions: 'GitHub Actions', jest: 'Jest', vitest: 'Vitest', git: 'Git', github: 'GitHub', figma: 'Figma',
};
const TILE = { dark: '#242938', light: '#F4F2ED' };
const GAP = 44; // between 256-unit tiles

const text = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.text();
};

let uid = 0;
async function tile(item, theme) {
  const n = uid++;
  if (typeof item === 'string') {
    const svg = await text(`https://skillicons.dev/icons?i=${item}&theme=${theme}`);
    const inner = svg.match(/<g transform="translate\(0, 0\)">\s*<svg[^>]*>([\s\S]*)<\/svg>\s*<\/g>/)?.[1];
    if (!inner) throw new Error(`Unexpected skillicons markup for ${item}`);
    // keep gradient and clip ids unique once the icons share one document
    const body = inner
      .replace(/\bid="([^"]+)"/g, `id="i${n}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#i${n}-$1)`)
      .replace(/href="#([^"]+)"/g, `href="#i${n}-$1"`);
    return { name: NAMES[item] ?? item, body };
  }
  const svg = await text(`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${item.si}.svg`);
  const d = svg.match(/<path d="([^"]+)"/)[1];
  const fill = theme === 'light' ? item.light ?? item.color : item.color;
  return {
    name: item.name,
    body: `<rect width="256" height="256" rx="60" fill="${TILE[theme]}"/><g transform="translate(56 56) scale(6)"><path d="${d}" fill="${fill}"/></g>`,
  };
}

await mkdir(OUT, { recursive: true });
for (const theme of ['dark', 'light']) {
  for (const [row, items] of Object.entries(ROWS)) {
    const tiles = await Promise.all(items.map((i) => tile(i, theme)));
    const w = tiles.length * 256 + (tiles.length - 1) * GAP;
    const label = tiles.map((t) => t.name).join(', ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${(w / 256) * 48}" height="48" viewBox="0 0 ${w} 256" fill="none" role="img" aria-label="${label}">
<title>${label}</title>
${tiles.map((t, i) => `<svg x="${i * (256 + GAP)}" y="0" width="256" height="256" viewBox="0 0 256 256" fill="none"><title>${t.name}</title>${t.body}</svg>`).join('\n')}
</svg>
`;
    await writeFile(join(OUT, `${row}-${theme}.svg`), svg);
  }
}
console.log('Stack rows written to assets/stack');
