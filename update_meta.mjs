import fs from 'fs';
import path from 'path';

const ctas = [
  "Peça seu orçamento!",
  "Chame no WhatsApp!",
  "Confira os tamanhos!",
  "Fale com nossa equipe!",
  "Solicite agora mesmo!",
  "Garanta a sua hoje!",
  "Entre em contato já!",
  "Reserve pelo Zap!"
];

const middlePhrases = [
  "Remoção ágil e segura de entulhos para sua obra fluir bem.",
  "Atendimento pontual com frota própria e destinação certa.",
  "Sua construção ou reforma mais limpa com nosso serviço.",
  "Descarte ecologicamente correto com licenças ambientais.",
  "A melhor solução para não acumular resíduos no local.",
  "Equipe preparada para entregar e recolher com agilidade.",
  "Preço justo e compromisso com o sucesso do seu projeto.",
  "Facilite o andamento da sua obra de pequeno ou grande porte.",
  "Evite dores de cabeça com caçambas legalizadas e seguras.",
  "Eficiência na retirada de materiais mistos e construção.",
  "Deixe o trabalho pesado de coleta de entulho com a gente.",
  "Cuidado com a sua calçada e rapidez no recolhimento total."
];

// Combine carefully to avoid duplicates
let usedCombinations = new Set();

function generateDescription(keyword) {
  let attempts = 0;
  while (attempts < 1000) {
    const cta = ctas[Math.floor(Math.random() * ctas.length)];
    const middle = middlePhrases[Math.floor(Math.random() * middlePhrases.length)];
    
    let cleanKeyword = keyword.trim();
    if (!cleanKeyword.endsWith('.') && !cleanKeyword.endsWith('!') && !cleanKeyword.endsWith('?')) {
      cleanKeyword += '.';
    }
    
    const text = `${cleanKeyword} ${middle} ${cta}`;
    const length = text.length;
    
    // Needs to be between 130 and 155 chars
    if (length >= 130 && length <= 155 && !usedCombinations.has(text)) {
      usedCombinations.add(text);
      return text;
    }
    attempts++;
  }
  
  // If random fails, construct one systematically
  for (let c of ctas) {
    for (let m of middlePhrases) {
      let cleanKeyword = keyword.trim();
      if (!cleanKeyword.endsWith('.') && !cleanKeyword.endsWith('!') && !cleanKeyword.endsWith('?')) {
        cleanKeyword += '.';
      }
      const text = `${cleanKeyword} ${m} ${c}`;
      if (text.length >= 130 && text.length <= 155 && !usedCombinations.has(text)) {
        usedCombinations.add(text);
        return text;
      }
    }
  }
  
  // Artificially pad if needed (fallback)
  let base = `${keyword.trim()}. Serviço profissional. ${ctas[0]}`;
  while (base.length < 130) {
    base = base.replace("profissional.", "rápido, seguro e profissional.");
    if (base.length > 155) break;
  }
  return base;
}

function processMarkdownFiles(directory) {
  const files = fs.readdirSync(directory);
  let updatedCount = 0;
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = path.join(directory, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        let frontmatter = frontmatterMatch[1];
        
        let keyword = "";
        const seoKeywordMatch = frontmatter.match(/seoKeyword:\s*"(.*?)"/);
        if (seoKeywordMatch) {
          keyword = seoKeywordMatch[1];
        } else {
          const titleMatch = frontmatter.match(/title:\s*"(.*?)"/);
          if (titleMatch) {
            keyword = titleMatch[1].split('|')[0].trim();
          }
        }
        
        if (keyword) {
          const newDesc = generateDescription(keyword);
          
          if (frontmatter.match(/description:\s*".*?"/)) {
            frontmatter = frontmatter.replace(/description:\s*".*?"/, `description: "${newDesc}"`);
          } else {
            frontmatter += `\ndescription: "${newDesc}"`;
          }
          
          content = content.replace(/^---\n([\s\S]*?)\n---/, `---\n${frontmatter}\n---`);
          fs.writeFileSync(filePath, content);
          console.log(`[MD] ${file}: ${newDesc.length} chars`);
          updatedCount++;
        }
      }
    }
  }
  return updatedCount;
}

function processAstroFiles() {
  const pages = [
    { file: 'index.astro', keyword: "Aluguel de caçamba em Volta Redonda para obras e reformas" },
    { file: 'sobre.astro', keyword: "Aluguel de caçamba em Volta Redonda, conheça a nossa empresa" },
    { file: 'bairros-de-atuacao.astro', keyword: "Aluguel de caçamba em Volta Redonda nos principais bairros" },
    { file: 'contato.astro', keyword: "Aluguel de caçamba em Volta Redonda, fale com nossa equipe" },
    { file: 'privacidade.astro', keyword: "Aluguel de caçamba em Volta Redonda, política de dados segura" },
    { file: 'termos.astro', keyword: "Aluguel de caçamba em Volta Redonda, nossos termos de uso" },
    { file: 'servicos/index.astro', keyword: "Aluguel de caçamba em Volta Redonda e serviços especializados" },
  ];
  
  const pagesDir = path.join(process.cwd(), 'src/pages');
  let updatedCount = 0;
  
  for (const page of pages) {
    const filePath = path.join(pagesDir, page.file);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const newDesc = generateDescription(page.keyword);
    
    const layoutMatch = content.match(/<Layout\s+([^>]*?)>/);
    if (layoutMatch) {
      let layoutProps = layoutMatch[1];
      if (layoutProps.includes('description=')) {
        layoutProps = layoutProps.replace(/description=".*?"/, `description="${newDesc}"`);
      } else {
        layoutProps += ` description="${newDesc}"`;
      }
      content = content.replace(/<Layout\s+[^>]*?>/, `<Layout ${layoutProps}>`);
      fs.writeFileSync(filePath, content);
      console.log(`[ASTRO] ${page.file}: ${newDesc.length} chars`);
      updatedCount++;
    }
  }
  return updatedCount;
}

console.log("=== INICIANDO ATUALIZAÇÃO DE META DESCRIÇÕES ===");
const bairrosCount = processMarkdownFiles(path.join(process.cwd(), 'src/content/bairros'));
const servicosCount = processMarkdownFiles(path.join(process.cwd(), 'src/content/servicos'));
const astroCount = processAstroFiles();

console.log(`\n=== RESUMO ===`);
console.log(`Bairros atualizados: ${bairrosCount}`);
console.log(`Serviços atualizados: ${servicosCount}`);
console.log(`Páginas Astro atualizadas: ${astroCount}`);
console.log(`Total de combinações únicas usadas: ${usedCombinations.size}`);
