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

if (!token) {
  console.error('Erro: Token não fornecido. Use a variável de ambiente GITHUB_TOKEN ou passe como argumento.');
  process.exit(1);
}

async function pushToGit() {
  console.log('Obtendo status dos arquivos...');
  const status = await git.statusMatrix({ fs, dir });
  
  const changedRows = status.filter(row => row[2] !== row[3]);
  console.log(`Foram encontrados ${changedRows.length} arquivos modificados/deletados.`);

  if (changedRows.length === 0) {
    console.log('Nenhum arquivo modificado para commitar.');
  } else {
    console.log('Atualizando o índice do git (add/remove)...');
    for (const row of changedRows) {
      const filepath = row[0];
      const inWorkDir = row[2] !== 0;
      if (inWorkDir) {
        await git.add({ fs, dir, filepath });
      } else {
        await git.remove({ fs, dir, filepath });
      }
    }

    console.log('Criando commit...');
    let sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'couto-wlp',
        email: 'coutowlp@gmail.com',
      },
      message: 'feat: adicionar paginas dos bairros 249, Belmonte, Niteroi, Jardim Suica, Santa Rita de Zarur, Jardim Europa e Sideropolis'
    });
    console.log(`Commit criado com sucesso: ${sha}`);
  }

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
