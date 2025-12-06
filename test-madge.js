const madge = require('madge');
madge('apps/api/src', { tsConfig: 'apps/api/tsconfig.json', fileExtensions: ['ts', 'tsx'] })
  .then((res) => {
    const obj = res.obj();
    require('fs').writeFileSync('docs/migration/dependency-map.json', JSON.stringify(obj, null, 2));
  })
  .catch((err) => {
    process.stderr.write(String(err));
    process.exit(1);
  });
