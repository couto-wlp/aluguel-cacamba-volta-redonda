import fs from 'fs';
import path from 'path';

const dirPath = "c:\\Users\\WELLIS\\Downloads\\aluguel de caçamba volta redonda\\src\\content\\bairros";
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));

for (const file of files) {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extrai o título base que colocamos antes
    const titleMatch = content.match(/title:\s*"(.*?)\s*\|\s*Volta Redonda/);
    if (!titleMatch) continue;
    
    const coreTitle = titleMatch[1]; // Ex: "Remoção de Entulho no Aterrado Sul"
    
    // Extrai a palavra-chave principal
    const prefixMatch = coreTitle.match(/^(.*?)\s+(no|na|em|nos|nas)\s+/i);
    let keywordPrefix = prefixMatch ? prefixMatch[1] : "Aluguel de caçamba";
    
    // 1. Substitui a seoKeyword para ser idêntica ao título base
    content = content.replace(/seoKeyword:\s*".*?"/, `seoKeyword: "${coreTitle}"`);
    
    // 2. Substitui o começo da description ("Aluguel de caçamba") pela nova palavra-chave
    content = content.replace(/description:\s*"Aluguel de caçamba(s?)/i, `description: "${keywordPrefix}`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Atualizado ${file} com a palavra: ${keywordPrefix}`);
}
