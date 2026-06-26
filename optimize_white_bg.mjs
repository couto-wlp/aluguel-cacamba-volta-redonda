import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  { name: 'entulho-gesso' },
  { name: 'entulho-construcao' },
  { name: 'entulho-jardinagem' },
  { name: 'entulho-madeiras' },
  { name: 'materiais-mistos' },
];

async function processAll() {
  for (const img of images) {
    const srcPath   = `src/assets/${img.name}.webp`;
    const tmpPath   = `src/assets/${img.name}_opt.webp`;
    const pubPath   = `public/${img.name}.webp`;
    const pubTmp    = `public/${img.name}_opt.webp`;

    const beforeSize = fs.statSync(srcPath).size;

    // Write to new file name first
    await sharp(srcPath)
      .resize({ width: 800, height: 800, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .webp({ quality: 75, effort: 6 })
      .toFile(tmpPath);

    // Copy to public with _opt name too
    fs.copyFileSync(tmpPath, pubTmp);

    const afterSize = fs.statSync(tmpPath).size;
    const saved = Math.round((1 - afterSize / beforeSize) * 100);
    console.log(`✅ ${img.name}: ${Math.round(beforeSize/1024)}KB → ${Math.round(afterSize/1024)}KB (${saved}% menor)`);
    console.log(`   Arquivo gerado: src/assets/${img.name}_opt.webp`);
  }
  console.log('\n🎉 Concluído! Arquivos gerados com sufixo _opt');
  console.log('Atualize os frontmatter .md para usar o novo nome, ou renomeie manualmente.');
}

processAll().catch(console.error);
