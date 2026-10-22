// Run after npm run build. Dependencies come ONLY from Next's trace manifests.
import {
  cpSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = process.cwd();
const target = mkdtempSync(path.join(tmpdir(), 'paskolos-traced-'));
function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(file);
    else yield file;
  }
}
let server;
try {
  // The trace lists dependencies; its server entry point is supplied by the host.
  const files = new Set([path.join(root, 'node_modules/next/dist/server/next-server.js')]);
  for (const manifest of walk(path.join(root, '.next'))) {
    if (!manifest.endsWith('.nft.json')) continue;
    for (const name of JSON.parse(readFileSync(manifest, 'utf8')).files) {
      files.add(path.resolve(path.dirname(manifest), name));
    }
  }
  for (const source of files) {
    const relative = path.relative(root, source);
    assert.ok(!relative.startsWith('..'), `Trace outside project: ${relative}`);
    if (!existsSync(source)) continue;
    const destination = path.join(target, relative);
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(source, destination);
  }
  cpSync(path.join(root, '.next'), path.join(target, '.next'), { recursive: true });
  cpSync(path.join(root, 'public'), path.join(target, 'public'), { recursive: true });
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    DATABASE_URL: 'file:./artifact-test.db',
    NEXTAUTH_SECRET: 'artifact-test-only-secret',
    ALLOW_INDEXING: 'false',
    NODE_PATH: '',
  };
  const bootstrap = spawnSync(process.execPath, ['scripts/prepare-runtime.mjs'], {
    cwd: target,
    env,
    encoding: 'utf8',
  });
  assert.equal(bootstrap.status, 0, bootstrap.stdout + bootstrap.stderr);
  console.log('Traced artifact: migrations and seed passed without npm install.');
  let logs = '';
  server = spawn(
    process.execPath,
    [
      '-e',
      `
    const http = require('node:http');
    const conf = require('./.next/required-server-files.json').config;
    const NextServer = require('next/dist/server/next-server').default;
    const app = new NextServer({ dev: false, conf, dir: process.cwd(), hostname: '127.0.0.1', port: 3000 });
    app.prepare().then(() => {
      const server = http.createServer(app.getRequestHandler());
      server.listen(0, '127.0.0.1', () => console.log('ARTIFACT_PORT=' + server.address().port));
    }).catch(error => { console.error(error); process.exit(1); });
  `,
    ],
    { cwd: target, env, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  server.stdout.on('data', (data) => {
    logs += data;
  });
  server.stderr.on('data', (data) => {
    logs += data;
  });
  let port;
  for (let attempt = 0; attempt < 300; attempt++) {
    port = logs.match(/ARTIFACT_PORT=(\d+)/)?.[1];
    if (port || server.exitCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(port, logs);
  for (const route of ['/', '/palyginimas', '/naujienos']) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    assert.equal(response.status, 200, `${route}: ${logs}`);
    assert.ok((await response.text()).length > 1000);
    console.log(`Traced artifact: ${route} HTTP 200`);
  }
} finally {
  if (server && server.exitCode === null) {
    const stopped = new Promise((resolve) => server.once('exit', resolve));
    server.kill('SIGTERM');
    await stopped;
  }
  rmSync(target, { recursive: true, force: true });
}
