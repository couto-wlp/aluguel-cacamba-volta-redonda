import sharp from 'sharp';

async function test() {
  const name = 'entulho-gesso';
  const file = `src/assets/${name}.png`;
  
  const image = sharp(file);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const channels = info.channels;
  
  function isBgColor(r, g, b, x, y) {
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;
    
    if (diff > 12) return false; // low saturation
    
    const avg = (r + g + b) / 3;
    
    const gridX = Math.floor(x / 20);
    const gridY = Math.floor(y / 20);
    
    const rx = x % 20;
    const ry = y % 20;
    const isEdge = (rx === 0 || rx === 19 || ry === 0 || ry === 19);
    
    if (isEdge) {
      return avg >= 165;
    }
    
    const expectedIsWhite = (gridX + gridY) % 2 === 1;
    if (expectedIsWhite) {
      return avg >= 225;
    } else {
      return avg >= 170 && avg <= 220;
    }
  }
  
  const visited = new Uint8Array(width * height);
  const isBackground = new Uint8Array(width * height);
  const queue = [];
  
  // Start from borders
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
  
  let count = 0;
  for (let i = 0; i < width * height; i++) {
    if (isBackground[i]) count++;
  }
  
  console.log(`Flooded background pixels with grid check: ${count} (${Math.round(count / (width*height) * 100)}%)`);
  
  // Let's check some pixels in the skip and debris area
  console.log(`Checking transparency of center pixels:`);
  const points = [
    { x: 500, y: 500, desc: 'Center of skip' },
    { x: 500, y: 350, desc: 'Inside gesso debris' },
    { x: 500, y: 200, desc: 'Above gesso debris (should be background/transparent)' },
  ];
  
  for (const p of points) {
    const idx = p.y * width + p.x;
    const isBg = isBackground[idx];
    const pIdx = idx * channels;
    const r = data[pIdx];
    const g = data[pIdx+1];
    const b = data[pIdx+2];
    console.log(`Point (${p.x}, ${p.y}) [${p.desc}]: RGB=(${r},${g},${b}) -> isBackground=${isBg}`);
  }
}

test().catch(console.error);
