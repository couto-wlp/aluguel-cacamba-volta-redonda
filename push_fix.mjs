import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';

const dir = process.cwd();
const token = process.argv[2];

async function pushToGit() {
  const status = await git.statusMatrix({ fs, dir });
  const modifiedFiles = status.filter(row => row[2] !== row[3]).map(row => row[0]);

  console.log(`${modifiedFiles.length} arquivos modificados:`);
  modifiedFiles.forEach(f => console.log('  -', f));

  if (modifiedFiles.length === 0) { console.log('Nada para commitar.'); return; }

  for (const filepath of modifiedFiles) await git.add({ fs, dir, filepath });

  const sha = await git.commit({
    fs, dir,
    author: { name: 'couto-wlp', email: 'coutowlp@gmail.com' },
    message: 'fix: Imagens dos cards com fundo branco e otimizadas (52-62% mais leves)'
  });
  console.log('Commit:', sha);

  const result = await git.push({ fs, http, dir, remote: 'origin', ref: 'main', onAuth: () => ({ username: token }) });
  console.log('✅ Push OK!', result.ok ? 'Sucesso' : result);
}

pushToGit().catch(console.error);
