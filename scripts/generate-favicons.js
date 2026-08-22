const sharp = require('sharp');
const path = require('path');

// Fuente: el app icon del kit-web (símbolo Plano Glaciar sobre fondo noche).
// Antes esto apuntaba a /public/yeti-logo.png — el Yeti caricatura. No lo
// vuelvas a apuntar ahí: ese archivo ya sólo vive en /public/brand/legacy/.
const input = path.join(__dirname, '../public/brand/appicon-512.png');
const publicDir = path.join(__dirname, '../public');

// favicon.ico, favicon-16x16, favicon-32x32 y apple-touch-icon NO se generan
// aquí ni salen del símbolo horizontal completo: a 16px esa banda se deshace
// (casi todo quedaba fondo #0B1420 y la tinta era ilegible). Usan una marca
// mínima dedicada — el chevron de salida (cian) + la cola (naranja) sobre la
// caja noche — que sí sobrevive a 16px. Fuente vectorial en
// public/brand/_src/favicon-square.svg (y favicon-rounded.svg para apple-touch).

async function generate() {
  // icon-192 para Android
  await sharp(input).resize(192, 192).png()
    .toFile(path.join(publicDir, 'icon-192x192.png'));

  // icon-512 para PWA
  await sharp(input).resize(512, 512).png()
    .toFile(path.join(publicDir, 'icon-512x512.png'));

  console.log('✓ Íconos PWA regenerados en /public');
}

// og-image.png (1200x630) — RESUELTO. Ya no es el composite viejo (fondo
// #2E2640 + cartoon + wordmark sans genérico). Ahora es una composición de
// marca: fondo Plano Glaciar #0B1420, el símbolo a color, el wordmark del
// sitio YETI·BI como TEXTO (punto medio cian #4FD1E0, BI naranja #E07B30, en
// Space Grotesk) y la tagline — sin caricatura y sin el wordmark de la "E"
// intervenida. Es un asset estático; su fuente es
// public/brand/_src/og-image.source.html (regenerar con Chromium headless a
// 1200x630 si hay que reeditar). El cartoon original vive en brand/legacy/.

generate().catch(console.error);
