const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require('child_process');

async function run() {
  try {
    const tag = core.getInput('tag');
    const runCommand = core.getInput('run_command');
    const token = process.env.REPO_GITHUB_TOKEN;
    const environment = process.env.ENVIRONMENT;
    const baseUrl = process.env.BASE_URL;
    const apiKey = process.env.API_KEY;
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    console.log(`Running tests with tag: ${tag}`);
    console.log(`Environment: ${environment}`);
    console.log(`Base URL: ${baseUrl}`);
    console.log(`API Key: ${apiKey ? '****' : 'Not Provided'}`);
    console.log(`Username: ${username ? '****' : 'Not Provided'}`);
    console.log(`Password: ${password ? '****' : 'Not Provided'}`);

    const result = execSync(`${runCommand} --grep @${tag}`, { encoding: 'utf-8' });
    console.log(result);

    core.setOutput('test-result', result);

    if (token) {
      const octokit = github.getOctokit(token);
      const { data: pullRequest } = await octokit.rest.pulls.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.payload.pull_request.number
      });
      console.log(`PR Title: ${pullRequest.title}`);
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
