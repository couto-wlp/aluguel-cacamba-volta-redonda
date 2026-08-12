import fs from 'fs';

const TOKEN = process.env.GITHUB_TOKEN || 'COLOQUE_SEU_TOKEN_AQUI';
const REPO = 'couto-wlp/aluguel-cacamba-volta-redonda';

async function githubApi(method, endpoint, body) {
  const url = `https://api.github.com/repos/${REPO}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
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
    console.log("Fetching repo info...");
    const ref = await githubApi('GET', '/git/refs/heads/main');
    const commitSha = ref.object.sha;

    const commit = await githubApi('GET', `/git/commits/${commitSha}`);
    const baseTreeSha = commit.tree.sha;

    const indexContent = fs.readFileSync('src/pages/index.astro', 'utf8');
    const configContent = fs.readFileSync('src/data/config.ts', 'utf8');
    const layoutContent = fs.readFileSync('src/layouts/Layout.astro', 'utf8');
    const seoContent = fs.readFileSync('src/components/SEO.astro', 'utf8');

    const treePayload = {
      base_tree: baseTreeSha,
      tree: [
        {
          path: 'src/pages/index.astro',
          mode: '100644',
          type: 'blob',
          content: indexContent
        },
        {
          path: 'src/data/config.ts',
          mode: '100644',
          type: 'blob',
          content: configContent
        },
        {
          path: 'src/layouts/Layout.astro',
          mode: '100644',
          type: 'blob',
          content: layoutContent
        },
        {
          path: 'src/components/SEO.astro',
          mode: '100644',
          type: 'blob',
          content: seoContent
        }
      ]
    };

    console.log("Creating new tree...");
    const newTree = await githubApi('POST', '/git/trees', treePayload);

    console.log("Creating commit...");
    const newCommit = await githubApi('POST', '/git/commits', {
      message: 'Aplicar leading-tight e mb-10 no H1 da home',
      tree: newTree.sha,
      parents: [commitSha]
    });

    console.log("Updating ref...");
    await githubApi('PATCH', '/git/refs/heads/main', {
      sha: newCommit.sha
    });

    console.log("Success! Pushed word changes to GitHub via API.");
  } catch (error) {
    console.error("Failed to update GitHub:", error);
  }
}

run();
