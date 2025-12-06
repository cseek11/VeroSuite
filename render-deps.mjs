import { promises as fs } from 'fs';
import { Graphviz } from '@hpcc-js/wasm';
import { Resvg } from '@resvg/resvg-js';

const data = JSON.parse(await fs.readFile('docs/migration/dependency-map.json','utf8'));
const nodes = new Set();
const edges = [];
for (const [from, deps] of Object.entries(data)) {
  nodes.add(from);
  for (const dep of deps) {
    nodes.add(dep);
    edges.push([from, dep]);
  }
}
let dot = 'digraph dependencies {\n  rankdir=LR;\n  node [shape=box, fontsize=8];\n';
for (const node of nodes) {
  const safe = node.replace(/"/g, '\\"');
  dot += `  "${safe}"\n`;
}
for (const [from, to] of edges) {
  const f = from.replace(/"/g, '\\"');
  const t = to.replace(/"/g, '\\"');
  dot += `  "${f}" -> "${t}"\n`;
}
dot += '}\n';

await fs.writeFile('docs/migration/dependency-map.dot', dot);
const gv = await Graphviz.load();
const svg = gv.layout(dot, 'svg', 'dot');
await fs.writeFile('docs/migration/dependency-map.svg', svg);
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1600 } });
const pngData = resvg.render().asPng();
await fs.writeFile('docs/migration/dependency-map.png', pngData);
