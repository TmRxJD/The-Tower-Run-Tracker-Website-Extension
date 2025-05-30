import { build } from 'esbuild';

build({
  entryPoints: ['background.js'],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  outfile: 'dist/background.js',
  target: ['chrome110'],
  external: [],
  minify: false,
  sourcemap: true,
  logLevel: 'info',
  define: {
    'window': 'self',
  },
}).catch(() => process.exit(1));
