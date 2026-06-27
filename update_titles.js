import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const titles = {
  "acude.md": "Aluguel de Caçamba no Açude",
  "aero-clube.md": "Locação de Caçambas no Aero Clube",
  "agua-limpa.md": "Retirada de Entulho na Água Limpa",
  "area-industrial-csn.md": "Caçambas para Indústria e Obras na Área Industrial CSN",
  "aterrado.md": "Coleta de Entulho e Resíduos no Aterrado",
  "aterrado-norte.md": "Caçamba Estacionária no Aterrado Norte",
  "aterrado-sul.md": "Remoção de Entulho no Aterrado Sul",
  "belo-horizonte.md": "Aluguel de Caçamba para Reformas no Belo Horizonte",
  "bom-jesus.md": "Descarte de Entulho Legalizado no Bom Jesus",
  "brasilandia.md": "Caçamba para Obras na Brasilândia",
  "candelaria.md": "Locação de Caçamba Rápida na Candelária",
  "casa-de-pedra.md": "Disk Caçamba e Coleta na Casa de Pedra",
  "conforto.md": "Serviços de Caçamba no Conforto",
  "conforto-ii.md": "Retirada de Resíduos de Construção no Conforto II",
  "coqueiros.md": "Aluguel de Caçamba de Entulho nos Coqueiros",
  "dom-bosco.md": "Locação de Caçamba Estacionária no Dom Bosco",
  "fazendinha.md": "Caçambas de Entulho na Fazendinha",
  "jardim-amalia.md": "Remoção de Resíduos no Jardim Amália",
  "jardim-amalia-ii.md": "Gestão de Entulho de Alto Padrão no Jardim Amália II",
  "jardim-belvedere.md": "Locação de Caçambas para Condomínios no Jardim Belvedere",
  "jardim-normandia.md": "Locação de Caçambas no Jardim Normândia",
  "jardim-paraiba.md": "Locação de Caçambas no Jardim Paraíba",
  "jardim-tiradentes.md": "Locação de Caçambas no Jardim Tiradentes",
  "laranjal.md": "Caçambas para Entulho no Laranjal",
  "monte-castelo.md": "Caçambas de Entulho no Monte Castelo",
  "morro-da-caviana.md": "Retirada de Entulho de Reformas no Morro da Caviana",
  "morro-da-conquista.md": "Caçamba de Entulho no Morro da Conquista",
  "morro-da-paz.md": "Remoção de Entulhos e Resíduos no Morro da Paz",
  "morro-da-paz-ii.md": "Aluguel de Caçamba Licenciada no Morro da Paz II",
  "morro-da-serra.md": "Descarte de Entulho com Caçamba no Morro da Serra",
  "morro-dos-cabritos.md": "Coleta de Resíduos de Obra no Morro dos Cabritos",
  "padre-josimo.md": "Caçambas para Descarte Seguro no Padre Josimo",
  "parque-das-ilhas.md": "Locação de Caçamba Legalizada no Parque das Ilhas",
  "pinto-da-serra.md": "Disk Entulho e Caçambas no Pinto da Serra",
  "ponte-alta.md": "Aluguel de Caçamba Estacionária na Ponte Alta",
  "ponte-alta-norte.md": "Retirada Rápida de Entulho na Ponte Alta Norte",
  "ponte-alta-sul.md": "Caçamba de Entulho para Obra na Ponte Alta Sul",
  "regiao-da-csn.md": "Caçambas de Grande Porte na Região da CSN",
  "retiro.md": "Locação Ágil de Caçambas no Retiro",
  "retiro-ii.md": "Aluguel de Caçamba para Entulho no Retiro II",
  "rodovia-do-contorno.md": "Coleta de Entulho e Resíduos na Rodovia do Contorno",
  "roma.md": "Remoção Segura de Entulho no Roma",
  "santa-cruz.md": "Coleta de Entulho Especializada na Santa Cruz",
  "santa-ines.md": "Disk Caçamba Rápido na Santa Inês",
  "santo-agostinho.md": "Aluguel de Caçambas no Santo Agostinho",
  "santo-agostinho-ii.md": "Caçamba para Limpeza de Terreno no Santo Agostinho II",
  "sao-geraldo.md": "Locação de Caçamba para Reforma no São Geraldo",
  "sao-joao.md": "Descarte Consciente de Entulho no São João",
  "sao-lucas.md": "Retirada de Entulho no São Lucas",
  "sao-luis.md": "Caçamba Estacionária para Locação no São Luís",
  "sao-sebastiao.md": "Remoção de Entulho de Construção no São Sebastião",
  "siderlandia.md": "Aluguel de Caçamba Rápida na Siderlândia",
  "tres-pocos.md": "Locação de Caçamba de Resíduos em Três Poços",
  "tres-pocos-industrial.md": "Caçamba para Indústria e Comércio em Três Poços Industrial",
  "vila-americana.md": "Coleta de Resíduos Sólidos na Vila Americana",
  "vila-brasilia.md": "Disk Caçamba Legalizada na Vila Brasília",
  "vila-delgado.md": "Aluguel de Caçambas Estacionárias na Vila Delgado",
  "vila-mury.md": "Caçamba para Entulho Rápida na Vila Mury",
  "vila-mury-norte.md": "Remoção de Entulho Licenciada na Vila Mury Norte",
  "vila-mury-sul.md": "Locação de Caçambas e Coleta na Vila Mury Sul",
  "vila-rica.md": "Retirada de Entulho de Obras na Vila Rica",
  "vila-rica-ii.md": "Aluguel de Caçamba para Construção na Vila Rica II",
  "vila-santa-cecilia.md": "Caçamba de Entulho Legalizada na Vila Santa Cecília",
  "vila-santa-cecilia-norte.md": "Locação de Caçamba na Vila Santa Cecília Norte",
  "vila-santa-cecilia-sul.md": "Serviços de Caçamba Rápida na Vila Santa Cecília Sul",
  "voldac.md": "Aluguel de Caçambas e Entulho na Voldac"
};

const dirPath = path.join(__dirname, 'src', 'content', 'bairros');

for (const [filename, newTitle] of Object.entries(titles)) {
  const filePath = path.join(dirPath, filename);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const fullTitle = `${newTitle} | Volta Redonda - RJ`;
    
    // Trocar o title no frontmatter
    content = content.replace(/title:\s*".*?"/, `title: "${fullTitle}"`);
    
    // Trocar o Heading H1 no corpo do texto para refletir a nova variação
    content = content.replace(/#\s+Aluguel de Caçamba (no|na|em) (.*?)\r?\n/, `# ${newTitle}\n`);

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Atualizado: ${filename}`);
  }
}
