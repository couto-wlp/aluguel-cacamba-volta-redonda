const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

const dir = process.cwd();
let token = process.env.GITHUB_TOKEN || process.argv[2];

if (!token && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/GITHUB_TOKEN\s*=\s*["']?(.*?)["']?$/m);
  if (match) {
    token = match[1].trim();
  }
}
const branchName = 'atualizacao-seo-' + Date.now();

if (!token) {
  console.error('Erro: Token não fornecido. Use a variável de ambiente GITHUB_TOKEN ou passe como argumento.');
  process.exit(1);
}

async function pushToGit() {
  console.log(`Criando a branch ${branchName}...`);
  try {
    await git.branch({ fs, dir, ref: branchName });
  } catch (e) {
    if (!e.message.includes('already exists')) throw e;
  }
  
  await git.checkout({ fs, dir, ref: branchName });
  console.log(`Branch mudada para ${branchName}`);

  console.log('Fazendo push para o GitHub...');
  
  let pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: branchName,
    onAuth: () => ({ username: token })
  });

  console.log('Push finalizado com sucesso!');
  console.log(pushResult);
  
  // Volta para main depois do push
  await git.checkout({ fs, dir, ref: 'main' });
}

pushToGit().catch(console.error);
