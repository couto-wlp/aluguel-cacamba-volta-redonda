import sharp from 'sharp';
import fs from 'fs';

async function removeCheckerboardAndOptimize(name) {
  const inputPng = `src/assets/${name}.png`;
  const outputWebp = `src/assets/${name}_opt.webp`;
  const publicWebp = `public/${name}_opt.webp`;
  const publicWebpOrig = `public/${name}.webp`;
  
  console.log(`\n--- Processing ${name} ---`);
  
  if (!fs.existsSync(inputPng)) {
    console.error(`Error: Source file ${inputPng} does not exist.`);
    return;
  }

  // 1. Load image and get raw RGBA data
  const image = sharp(inputPng);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const channels = info.channels;
  const visited = new Uint8Array(width * height);
  const isBackground = new Uint8Array(width * height);
  const queue = [];
  
  // Grid-aware checkerboard matching
  function isBgColor(r, g, b, x, y) {
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;
    
    // Saturation check (grayscale)
    if (diff > 12) return false;
    
    const avg = (r + g + b) / 3;
    
    const gridX = Math.floor(x / 20);
    const gridY = Math.floor(y / 20);
    
    const rx = x % 20;
    const ry = y % 20;
    const isEdge = (rx === 0 || rx === 19 || ry === 0 || ry === 19);
    
    // On the transition edges, we accept either white or gray
    if (isEdge) {
      return avg >= 165;
    }
    
    const expectedIsWhite = (gridX + gridY) % 2 === 1;
    if (expectedIsWhite) {
      return avg >= 225; // White square
    } else {
      return avg >= 170 && avg <= 220; // Gray square
    }
  }
  
  // Push all border pixels to queue
  for (let x = 0; x < width; x++) {
    let idx = x;
    queue.push(idx);
    visited[idx] = 1;
    
    idx = (height - 1) * width + x;
    queue.push(idx);
    visited[idx] = 1;
  }
  for (let y = 1; y < height - 1; y++) {
    let idx = y * width;
    queue.push(idx);
    visited[idx] = 1;
    
    idx = y * width + (width - 1);
    queue.push(idx);
    visited[idx] = 1;
  }
  
  // BFS
  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);
    
    const pIdx = idx * channels;
    const r = data[pIdx];
    const g = data[pIdx+1];
    const b = data[pIdx+2];
    
    if (isBgColor(r, g, b, x, y)) {
      isBackground[idx] = 1;
      
      const neighbors = [
        { nx: x - 1, ny: y },
        { nx: x + 1, ny: y },
        { nx: x, ny: y - 1 },
        { nx: x, ny: y + 1 }
      ];
      
      for (const { nx, ny } of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (!visited[nIdx]) {
            visited[nIdx] = 1;
            queue.push(nIdx);
          }
        }
      }
    }
  }
  
  // Mark background as transparent
  let count = 0;
  for (let i = 0; i < width * height; i++) {
    if (isBackground[i]) {
      const pIdx = i * channels;
      data[pIdx] = 0;
      data[pIdx+1] = 0;
      data[pIdx+2] = 0;
      data[pIdx+3] = 0; // Alpha = 0 (transparent)
      count++;
    }
  }
  
  console.log(`Flooded background pixels: ${count} of ${width * height} (${Math.round(count / (width * height) * 100)}%)`);
  
  // 2. Resize and output as WebP with alpha transparent
  const cleanRaw = sharp(data, {
    raw: {
      width,
      height,
      channels
    }
  });
  
  // Resize to 800x800 contain, background transparent
  await cleanRaw
    .resize({ width: 800, height: 800, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .webp({ quality: 75, effort: 6 })
    .toFile(outputWebp);
    
  console.log(`Generated transparent WebP: ${outputWebp}`);
  
  // Copy to public directory
  fs.copyFileSync(outputWebp, publicWebp);
  console.log(`Copied to public: ${publicWebp}`);
  
  // Also copy to public/name.webp (without _opt)
  fs.copyFileSync(outputWebp, publicWebpOrig);
  console.log(`Copied to public: ${publicWebpOrig}`);
}

async function run() {
  const images = [
    'entulho-construcao',
    'entulho-gesso',
    'entulho-jardinagem',
    'entulho-madeiras',
    'materiais-mistos'
  ];
  for (const name of images) {
    await removeCheckerboardAndOptimize(name);
  }
  console.log('\n🎉 Finished processing all images with the grid-aware algorithm!');
}

run().catch(console.error);
