import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.cjs';
import fs from 'fs';

const dir = process.cwd();
let token = process.env.GITHUB_TOKEN || process.argv[2];

if (!token && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/GITHUB_TOKEN\s*=\s*["']?(.*?)["']?$/m);
  if (match) {
    token = match[1].trim();
  }
}

if (!token) {
  console.error('Erro: Token não fornecido. Use a variável de ambiente GITHUB_TOKEN ou passe como argumento.');
  process.exit(1);
}

async function pushToGit() {
  console.log('Obtendo status dos arquivos...');
  const status = await git.statusMatrix({ fs, dir });
  
  const modifiedFiles = status
    .filter(row => row[2] !== row[3])
    .map(row => row[0]);

  console.log(`Foram encontrados ${modifiedFiles.length} arquivos modificados.`);

  if (modifiedFiles.length === 0) {
    console.log('Nenhum arquivo modificado para commitar.');
    return;
  }

  console.log('Adicionando arquivos...');
  for (const filepath of modifiedFiles) {
    await git.add({ fs, dir, filepath });
  }

  console.log('Criando commit...');
  let sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'couto-wlp',
      email: 'coutowlp@gmail.com',
    },
    message: 'SEO: Atualização em massa das meta descrições'
  });
  console.log(`Commit criado com sucesso: ${sha}`);

  console.log('Fazendo push para o GitHub...');
  
  let pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({ username: token })
  });

  console.log('Push finalizado!');
  console.log(pushResult);
}

pushToGit().catch(console.error);
