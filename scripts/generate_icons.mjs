import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, getPixel) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter 0: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = Math.max(0, Math.min(255, Math.round(r)));
      rawData[pxOffset + 1] = Math.max(0, Math.min(255, Math.round(g)));
      rawData[pxOffset + 2] = Math.max(0, Math.min(255, Math.round(b)));
      rawData[pxOffset + 3] = Math.max(0, Math.min(255, Math.round(a)));
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    const crc = crc32(Buffer.concat([Buffer.from(type), data]));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

/**
 * Render sleek Topic Master branded icon (squircle + layered isometric syllabus diamonds + sparkle)
 */
function renderTopicMasterPixel(x, y, size) {
  // Normalize coordinates to [0, 1]
  const u = x / (size - 1);
  const v = y / (size - 1);
  const cx = 0.5;
  const cy = 0.5;

  // Squircle rounded box math
  const nx = Math.abs((u - cx) / 0.44);
  const ny = Math.abs((v - cy) / 0.44);
  const distSquircle = Math.pow(Math.pow(nx, 4) + Math.pow(ny, 4), 1/4);

  if (distSquircle > 1.05) {
    // Outside icon boundary
    return [0, 0, 0, 0];
  }

  // Smooth anti-aliased edge
  let alpha = 255;
  if (distSquircle > 0.95) {
    alpha = Math.round(255 * (1 - (distSquircle - 0.95) / 0.1));
  }

  // Background gradient: Dark navy to deep obsidian
  const bgR = 10 + 6 * (1 - v);
  const bgG = 15 + 10 * (1 - v);
  const bgB = 26 + 18 * (1 - v);

  // Border glow
  let r = bgR;
  let g = bgG;
  let b = bgB;

  if (distSquircle >= 0.85) {
    // Glowing gradient border
    const borderBlend = (distSquircle - 0.85) / 0.15;
    const borderR = 99 + 80 * u;
    const borderG = 102 + 100 * (1 - v);
    const borderB = 241 + 14 * v;
    r = r * (1 - borderBlend) + borderR * borderBlend;
    g = g * (1 - borderBlend) + borderG * borderBlend;
    b = b * (1 - borderBlend) + borderB * borderBlend;
    return [r, g, b, alpha];
  }

  // Centered isometric diamond stack (Topic Master Syllabus Stack)
  const dx = (u - 0.5) * 2;
  const dy = (v - 0.5) * 2;

  // Isometric projection: isoX = (dx - dy), isoY = (dx + dy) * 0.5
  // Layer 1 (Top diamond): Center (0, -0.15), radius 0.5
  const topDist = Math.abs(dx * 1.4) + Math.abs((dy + 0.18) * 2.2);
  if (topDist <= 0.72) {
    // Top Diamond (Vivid Electric Indigo to Cyan)
    const t = (u + (1 - v)) * 0.5;
    const coreR = 56 * (1 - t) + 168 * t;
    const coreG = 189 * (1 - t) + 85 * t;
    const coreB = 248 * (1 - t) + 247 * t;

    // Highlight inner bevel
    if (topDist <= 0.35) {
      return [240, 245, 255, alpha];
    }
    return [coreR, coreG, coreB, alpha];
  }

  // Layer 2 (Middle diamond): Center (0, 0.12)
  const midDist = Math.abs(dx * 1.3) + Math.abs((dy - 0.12) * 2.1);
  if (midDist <= 0.72 && dy > 0.05) {
    const midR = 139 + 30 * u;
    const midG = 92 + 20 * (1 - v);
    const midB = 246;
    return [midR, midG, midB, alpha];
  }

  // Layer 3 (Bottom diamond): Center (0, 0.40)
  const botDist = Math.abs(dx * 1.2) + Math.abs((dy - 0.40) * 2.0);
  if (botDist <= 0.68 && dy > 0.28) {
    const botR = 6;
    const botG = 182;
    const botB = 212;
    return [botR, botG, botB, alpha];
  }

  // Sparkle at Top-Right (0.75, 0.25)
  const spDist = Math.sqrt(Math.pow(u - 0.76, 2) + Math.pow(v - 0.24, 2));
  if (spDist < 0.12) {
    const spRay = Math.min(Math.abs(u - 0.76), Math.abs(v - 0.24));
    if (spRay < 0.035 || spDist < 0.04) {
      return [254, 240, 138, alpha]; // Gold / White Sparkle
    }
  }

  // Ambient core background glow
  const centerDist = Math.sqrt(dx * dx + dy * dy);
  if (centerDist < 0.7) {
    const glowAmt = (1 - centerDist / 0.7) * 0.45;
    r = r + 80 * glowAmt;
    g = g + 90 * glowAmt;
    b = b + 190 * glowAmt;
  }

  return [r, g, b, alpha];
}

// Generate all target sizes
const sizes = [
  { file: 'public/favicon.png', size: 64 },
  { file: 'public/apple-touch-icon.png', size: 180 },
  { file: 'extension/icons/icon16.png', size: 16 },
  { file: 'extension/icons/icon32.png', size: 32 },
  { file: 'extension/icons/icon48.png', size: 48 },
  { file: 'extension/icons/icon128.png', size: 128 },
];

// Ensure extension/icons directory exists
fs.mkdirSync('extension/icons', { recursive: true });

for (const { file, size } of sizes) {
  const pngBuf = createPng(size, size, (x, y, s) => renderTopicMasterPixel(x, y, s));
  fs.writeFileSync(file, pngBuf);
  console.log(`Generated: ${file} (${size}x${size}, ${pngBuf.length} bytes)`);
}

// Also copy favicon.svg to extension/icons/icon.svg
fs.copyFileSync('public/favicon.svg', 'extension/icons/icon.svg');
console.log('Copied extension/icons/icon.svg');
