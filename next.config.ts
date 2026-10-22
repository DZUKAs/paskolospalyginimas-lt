import type { NextConfig } from 'next';
import { runtimePackageIncludes } from './scripts/runtime-package-includes.mjs';
import { readFileSync } from 'node:fs';
const legacy = JSON.parse(readFileSync('docs/migration/source/inventory.json', 'utf8')) as {
  url: string;
}[];
const posts = legacy
  .filter((x) => !x.url.includes('/loans/') && x.url.split('/').filter(Boolean).at(-1)!.length > 40)
  .map((x) => ({
    source: new URL(x.url).pathname.replace(/\/$/, ''),
    destination: '/naujienos' + new URL(x.url).pathname.replace(/\/$/, ''),
    permanent: false,
    statusCode: 301,
  }));
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/*': [
      './scripts/database-url.mjs',
      './scripts/ensure-db.mjs',
      './scripts/prepare-runtime.mjs',
      './scripts/run-command.mjs',
      './prisma/seed.mjs',
      './prisma/schema.prisma',
      './prisma/migrations/**/*',
      ...runtimePackageIncludes(),
      './node_modules/@prisma/**/*',
    ],
  },
  htmlLimitedBots: /.*/,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      ...posts,
      ...Object.entries({
        '/loan-comparison': '/palyginimas',
        '/comparison': '/palyginimas',
        '/loan-reviews': '/palyginimas',
        '/loan-reviews-grid': '/palyginimas',
        '/loans': '/palyginimas',
        '/about': '/apie-mus',
        '/contact': '/kontaktai',
        '/faq': '/duk',
        '/blog': '/naujienos',
        '/blog-left-sidebar': '/naujienos',
        '/blog-right-sidebar': '/naujienos',
        '/straipsniai': '/naujienos',
        '/service': '/palyginimas',
        '/terms-conditions': '/naudojimo-salygos',
        '/sitemap.html': '/svetaines-zemelapis',
      }).map(([source, destination]) => ({ source, destination, statusCode: 301 })),
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};
export default config;
