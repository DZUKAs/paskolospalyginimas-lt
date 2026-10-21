/** Runs in the actual Node server, including managed Next.js launchers. */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { execFileSync } = await import('node:child_process');
    const path = await import('node:path');
    execFileSync(process.execPath, [path.join(process.cwd(), 'scripts/prepare-runtime.mjs')], {
      stdio: 'inherit',
      env: process.env,
    });
  }
}
