import { currentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  const expected = new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000').origin;
  if (req.headers.get('origin') !== expected)
    return NextResponse.json({ error: 'Neleistina užklausos kilmė.' }, { status: 403 });
  if (!(await currentUser())) return NextResponse.json({ error: 'Prisijunkite.' }, { status: 401 });
  if (Number(req.headers.get('content-length')) > 6 * 1024 * 1024)
    return NextResponse.json({ error: 'Failas per didelis.' }, { status: 413 });
  try {
    const reader = req.body?.getReader();
    if (!reader) return NextResponse.json({ error: 'Trūksta failo.' }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 6 * 1024 * 1024) {
        await reader.cancel();
        return NextResponse.json({ error: 'Užklausa per didelė.' }, { status: 413 });
      }
      chunks.push(value);
    }
    const f = await new Response(new Uint8Array(Buffer.concat(chunks)), {
      headers: { 'Content-Type': req.headers.get('content-type') || '' },
    }).formData();
    const file = f.get('file');
    if (
      !(file instanceof File) ||
      file.size > 5 * 1024 * 1024 ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    )
      return NextResponse.json({ error: 'Leidžiami JPG, PNG, WebP iki 5 MB.' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer, { limitInputPixels: 24000000 });
    const meta = await image.metadata();
    if (!['jpeg', 'png', 'webp'].includes(meta.format || '')) throw new Error('format');
    const output = await image
      .rotate()
      .resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    const name = randomUUID() + '.webp';
    await mkdir(path.join(process.cwd(), 'data/uploads'), { recursive: true });
    await writeFile(path.join(process.cwd(), 'data/uploads', name), output, { flag: 'wx' });
    return NextResponse.json({ url: '/uploads/' + name });
  } catch {
    return NextResponse.json({ error: 'Paveikslėlio apdoroti nepavyko.' }, { status: 400 });
  }
}
