/** Runs in the actual Node server, including managed Next.js launchers. */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { runCommand } = await import('./scripts/run-command.mjs');
    const path = await import('node:path');
    runCommand('bootstrap', process.execPath, [
      path.join(process.cwd(), 'scripts/prepare-runtime.mjs'),
    ]);
  }
}
