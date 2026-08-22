const sharp = require('sharp');
const path = require('path');

// Fuente: el app icon del kit-web (símbolo Plano Glaciar sobre fondo noche).
// Antes esto apuntaba a /public/yeti-logo.png — el Yeti caricatura. No lo
// vuelvas a apuntar ahí: ese archivo ya sólo vive en /public/brand/legacy/.
const input = path.join(__dirname, '../public/brand/appicon-512.png');
const publicDir = path.join(__dirname, '../public');

// favicon.ico, favicon-16x16, favicon-32x32 y apple-touch-icon NO se generan
// aquí: el kit-web ya los trae en los tamaños exactos, ajustados a mano para
// que el símbolo siga legible en tamaños mínimos. Reescalarlos desde 512
// los empastaría.

async function generate() {
  // icon-192 para Android
  await sharp(input).resize(192, 192).png()
    .toFile(path.join(publicDir, 'icon-192x192.png'));

  // icon-512 para PWA
  await sharp(input).resize(512, 512).png()
    .toFile(path.join(publicDir, 'icon-512x512.png'));

  console.log('✓ Íconos PWA regenerados en /public');
}

// PENDIENTE — og-image.png. La versión anterior se componía acá con sharp:
// fondo #2E2640 + el cartoon + un wordmark "YETI BI" en sans-serif genérica.
// Ese wordmark no es el del sitio (sin punto medio cian, naranja viejo #E07B30)
// y el fondo tampoco es el de Plano Glaciar. El kit-web no incluye un
// og-image 1200x630, así que la composición quedó sin resolver a propósito.

generate().catch(console.error);
