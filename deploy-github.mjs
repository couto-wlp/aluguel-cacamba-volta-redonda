import fs from 'fs';
import path from 'path';

const TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error("Token não fornecido.");
  process.exit(1);
}

const REPO = 'couto-wlp/aluguel-cacamba-volta-redonda';

async function githubApi(method, endpoint, body) {
  const url = `https://api.github.com/repos/${REPO}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'NodeJS-Deploy-Script'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error on ${method} ${url}: ${res.status} ${res.statusText}`);
    console.error(errorText);
    throw new Error('API Request Failed');
  }
  return res.json();
}

async function run() {
  try {
    console.log("Obtendo informações da branch main no GitHub...");
    const ref = await githubApi('GET', '/git/refs/heads/main');
    const commitSha = ref.object.sha;

    const commit = await githubApi('GET', `/git/commits/${commitSha}`);
    const baseTreeSha = commit.tree.sha;

    const filesToCommit = [
      'src/data/config.ts',
      'src/layouts/Layout.astro',
      'src/pages/index.astro',
      'src/pages/contato.astro',
      'src/pages/sobre.astro',
      'src/pages/servicos/index.astro',
      'src/pages/servicos/[slug].astro',
      'src/pages/[slug].astro',
      'src/pages/aluguel-[slug].astro',
      'src/content/servicos/cacamba-5m.md',
      'src/content/servicos/cacamba-6m.md',
      'src/content/servicos/cacamba-7m.md',
      'src/content/servicos/cacamba-8m.md',
      'src/content/servicos/cacamba-roll-on.md',
      'src/assets/cacamba-6m.webp',
      'src/assets/cacamba-5m.webp',
      'src/assets/cacamba-7m.webp',
      'src/assets/cacamba-8m.webp',
      'src/assets/cacamba-roll-on.webp',
      'src/assets/cacamba-4m.webp',
      'deploy-github.mjs'
    ];

    const tree = [];
    for (const filePath of filesToCommit) {
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).toLowerCase();
        const isBinary = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2'].includes(ext);

        if (isBinary) {
          console.log(`Enviando arquivo binário (blob) ${filePath}...`);
          const buffer = fs.readFileSync(filePath);
          const blob = await githubApi('POST', '/git/blobs', {
            content: buffer.toString('base64'),
            encoding: 'base64'
          });
          tree.push({
            path: filePath.replace(/\\/g, '/'),
            mode: '100644',
            type: 'blob',
            sha: blob.sha
          });
        } else {
          console.log(`Adicionando ${filePath}...`);
          const content = fs.readFileSync(filePath, 'utf8');
          tree.push({
            path: filePath.replace(/\\/g, '/'),
            mode: '100644',
            type: 'blob',
            content
          });
        }
      }
    }

    console.log("Criando nova árvore no Git...");
    const newTree = await githubApi('POST', '/git/trees', {
      base_tree: baseTreeSha,
      tree
    });

    console.log("Criando novo commit...");
    const message = process.argv[3] || 'Atualizar arquivos';
    const newCommit = await githubApi('POST', '/git/commits', {
      message,
      tree: newTree.sha,
      parents: [commitSha]
    });

    console.log("Atualizando branch main no GitHub...");
    await githubApi('PATCH', '/git/refs/heads/main', {
      sha: newCommit.sha
    });

    console.log("🚀 SUCESSO! Alterações enviadas com sucesso para o GitHub!");
  } catch (error) {
    console.error("Falha ao enviar para o GitHub:", error.message);
  }
}

run();
