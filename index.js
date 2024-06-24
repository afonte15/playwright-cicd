const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    // Check if node_modules folder exists, if not, install dependencies
    if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
      console.log('node_modules not found, installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }

    const repo = core.getInput('repo');
    const eventType = core.getInput('event-type');
    const clientPayload = JSON.parse(core.getInput('client-payload'));
    //const repoToken = core.getInput('repo-token');

    const [owner, repoName] = repo.split('/');

    const octokit = github.getOctokit();

    await octokit.rest.repos.createDispatchEvent({
      owner,
      repo: repoName,
      event_type: eventType,
      client_payload: clientPayload
    });

    core.info(`Dispatched event ${eventType} to ${repo}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
