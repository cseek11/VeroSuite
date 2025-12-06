const madge = require('madge');
const path = require('path');
const outPath = path.join('docs','migration','dependency-map.json');
madge('apps/api/src', { tsConfig: 'apps/api/tsconfig.json', fileExtensions: ['ts','tsx'] })
  .then((res) => {
    const obj = res.obj();
    require('fs').writeFileSync(outPath, JSON.stringify(obj, null, 2));
  })
  .catch((err) => {
    process.stderr.write(String(err));
    process.exit(1);
  });
