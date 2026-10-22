import { readFileSync } from 'node:fs';
import path from 'node:path';

// Explicit tracing globs copy files but do not follow those files' imports.
// Include the complete locked production dependency tree of the runtime CLI.
export function runtimePackageIncludes(root = process.cwd()) {
  const { packages } = JSON.parse(readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const visited = new Set();
  function visit(location) {
    if (visited.has(location)) return;
    const pkg = packages[location];
    if (!pkg) throw new Error(`Missing runtime package in lockfile: ${location}`);
    visited.add(location);
    for (const name of Object.keys({ ...pkg.dependencies, ...pkg.optionalDependencies })) {
      let parent = location;
      let found;
      while (true) {
        const candidate = path.posix.join(parent, 'node_modules', name);
        if (packages[candidate]) {
          found = candidate;
          break;
        }
        if (!parent) break;
        parent = path.posix.dirname(parent);
        if (parent === '.') parent = '';
      }
      if (found) visit(found);
      else if (!pkg.optionalDependencies?.[name]) {
        throw new Error(`Missing dependency ${name} of ${location}`);
      }
    }
  }
  visit('node_modules/prisma');
  return [...visited].sort().map((location) => `./${location}/**/*`);
}
