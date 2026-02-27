const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE = path.join(__dirname, '..', 'public', 'icons', 'icon-512x512.png');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');
const THEME_COLOR = { r: 5, g: 150, b: 105 }; // #059669

const STANDARD_SIZES = [48, 72, 96, 144, 192, 384, 512];
const APPLE_SIZES = [180];

async function generateStandardIcons() {
  // Read source into buffer first so we can overwrite the 512x512 file
  const sourceBuffer = fs.readFileSync(SOURCE);
  for (const size of STANDARD_SIZES) {
    const output = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    await sharp(sourceBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(output);
    console.log(`Created icon-${size}x${size}.png`);
  }
}

async function generateMaskableIcon() {
  // Maskable icons need content within the center 80% (safe zone)
  // Create a 512x512 canvas with theme color background
  // Place the icon at ~72% size centered (leaving ~14% padding each side for safe zone)
  const canvasSize = 512;
  const iconSize = Math.round(canvasSize * 0.72); // 368px - well within 80% safe zone
  const offset = Math.round((canvasSize - iconSize) / 2);

  const resizedIcon = await sharp(SOURCE)
    .resize(iconSize, iconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const output = path.join(OUTPUT_DIR, 'icon-maskable-512x512.png');
  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { ...THEME_COLOR, alpha: 1 },
    },
  })
    .composite([{ input: resizedIcon, left: offset, top: offset }])
    .png()
    .toFile(output);

  console.log('Created icon-maskable-512x512.png');
}

async function generateAppleIcons() {
  for (const size of APPLE_SIZES) {
    const output = path.join(OUTPUT_DIR, `apple-touch-icon-${size}x${size}.png`);
    await sharp(SOURCE)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(output);
    console.log(`Created apple-touch-icon-${size}x${size}.png`);

    // Also create the default apple-touch-icon.png (180x180)
    const defaultOutput = path.join(OUTPUT_DIR, 'apple-touch-icon.png');
    fs.copyFileSync(output, defaultOutput);
    console.log('Created apple-touch-icon.png (copy of 180x180)');
  }
}

async function main() {
  console.log('Generating PWA icons...\n');
  await generateStandardIcons();
  await generateMaskableIcon();
  await generateAppleIcons();
  console.log('\nAll icons generated successfully!');
}

main().catch(console.error);
