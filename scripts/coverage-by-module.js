const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const coveragePath = path.join(root, 'apps', 'api', 'coverage', 'coverage-final.json');
const outJson = path.join(root, 'docs', 'migration', 'coverage-modules.json');
const outTxt = path.join(root, 'docs', 'migration', 'coverage-modules.txt');

const data = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
const agg = {};

for (const [file, cov] of Object.entries(data)) {
  const match = file.match(/src[\\/](.+?)[\\/]/);
  if (!match) continue;
  const key = match[1];
  agg[key] = agg[key] || { covered: 0, total: 0 };
  if (cov.lines) {
    agg[key].covered += cov.lines.covered;
    agg[key].total += cov.lines.total;
  } else if (cov.s) {
    const statements = Object.values(cov.s);
    agg[key].covered += statements.filter((v) => v > 0).length;
    agg[key].total += statements.length;
  }
}

const rows = Object.entries(agg)
  .map(([module, { covered, total }]) => ({
    module,
    covered,
    total,
    pct: total ? Number(((covered / total) * 100).toFixed(2)) : 0,
  }))
  .sort((a, b) => a.module.localeCompare(b.module));

if (!rows.length) {
  throw new Error('No coverage rows generated from coverage-final.json');
}

fs.writeFileSync(outJson, JSON.stringify(rows, null, 2));
fs.writeFileSync(
  outTxt,
  rows.map((r) => `${r.module}\t${r.pct}% (${r.covered}/${r.total})`).join('\n'),
);

const debugPath = path.join(root, 'coverage-debug.txt');
fs.writeFileSync(
  debugPath,
  JSON.stringify({ root, outJson, outTxt, rowCount: rows.length }, null, 2),
);

