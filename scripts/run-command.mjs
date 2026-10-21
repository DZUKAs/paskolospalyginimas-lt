import { execFileSync } from 'node:child_process';

/** @param {string} text @param {NodeJS.ProcessEnv} env */
function redact(text, env) {
  for (const [name, value] of Object.entries(env)) {
    if (value && value.length >= 4 && /SECRET|PASSWORD|TOKEN|API_KEY|PRIVATE_KEY/i.test(name)) {
      text = text.split(value).join('[REDACTED]');
    }
  }
  return text;
}

/**
 * Preserve subprocess failures in the parent error: managed hosts may discard
 * inherited child stderr while only retaining the Next.js error itself.
 * @param {string} label
 * @param {string} executable
 * @param {string[]} args
 * @param {NodeJS.ProcessEnv} env
 */
export function runCommand(label, executable, args, env = process.env) {
  try {
    const output = execFileSync(executable, args, {
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
      maxBuffer: 4 * 1024 * 1024,
    });
    if (output) process.stdout.write(redact(output, env));
  } catch (error) {
    const e =
      /** @type {Error & {status?:number|null;signal?:string|null;code?:string;stdout?:string|Buffer;stderr?:string|Buffer}} */ (
        error
      );
    const details = [e.stdout?.toString(), e.stderr?.toString()].filter(Boolean).join('\n');
    const status = e.status ?? e.code ?? 'unknown';
    const safe = redact(details || e.message, env).slice(-16000);
    throw new Error(
      `[database:${label}] status=${status}${e.signal ? ` signal=${e.signal}` : ''}\n${safe}`,
    );
  }
}
