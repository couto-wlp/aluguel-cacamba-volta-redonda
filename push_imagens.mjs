import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';

const dir = process.cwd();
const token = process.env.GITHUB_TOKEN || process.argv[2];

if (!token) {
  console.error('Erro: Token não fornecido.');
  process.exit(1);
}

async function pushToGit() {
  console.log('Obtendo status dos arquivos...');
  const status = await git.statusMatrix({ fs, dir });
  
  const modifiedFiles = status
    .filter(row => row[2] !== row[3])
    .map(row => row[0]);

  console.log(`Foram encontrados ${modifiedFiles.length} arquivos modificados:`);
  modifiedFiles.forEach(f => console.log('  -', f));

  if (modifiedFiles.length === 0) {
    console.log('Nenhum arquivo modificado para commitar.');
    return;
  }

  console.log('\nAdicionando arquivos...');
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
    message: 'feat: Adição de imagens reais com fundo transparente nos cards de serviços da Home (Gesso/Drywall, Construção, Jardinagem, Madeiras/MDF, Materiais Mistos)'
  });
  console.log(`Commit criado: ${sha}`);

  console.log('Fazendo push para o GitHub...');
  
  let pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({ username: token })
  });

  console.log('✅ Push finalizado com sucesso!');
  console.log(pushResult);
}

pushToGit().catch(console.error);
