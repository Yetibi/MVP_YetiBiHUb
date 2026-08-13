const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const input = path.join(__dirname, '../public/yeti-logo.png');
const publicDir = path.join(__dirname, '../public');

async function generate() {
  // favicon 32x32
  await sharp(input).resize(32, 32).png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  // favicon 16x16
  await sharp(input).resize(16, 16).png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // apple-touch-icon 180x180
  await sharp(input).resize(180, 180).png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // icon-192 para Android
  await sharp(input).resize(192, 192).png()
    .toFile(path.join(publicDir, 'icon-192x192.png'));

  // icon-512 para PWA
  await sharp(input).resize(512, 512).png()
    .toFile(path.join(publicDir, 'icon-512x512.png'));

  // favicon.ico (32x32 PNG — compatible con browsers modernos)
  await sharp(input).resize(32, 32).png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  // OG Image 1200x630 — Yeti + fondo #2E2640
  const yeti = await sharp(input).resize(400, 400).png().toBuffer();

  await sharp({
    create: { width: 1200, height: 630, channels: 4,
      background: { r: 46, g: 38, b: 64, alpha: 1 } }
  })
  .composite([
    { input: yeti, top: 115, left: 700 },
    {
      input: Buffer.from(`<svg width="640" height="220">
        <text x="60" y="80" font-family="sans-serif" font-size="72" font-weight="900" fill="white">YETI BI</text>
        <text x="60" y="140" font-family="sans-serif" font-size="24" fill="#E07B30">Diagnóstico de Madurez</text>
        <text x="60" y="175" font-family="sans-serif" font-size="24" fill="#E07B30">Operacional</text>
      </svg>`),
      top: 205, left: 0
    }
  ])
  .png()
  .toFile(path.join(publicDir, 'og-image.png'));

  console.log('✓ Todos los assets generados en /public');
}

generate().catch(console.error);
