const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require('child_process');

try {
  const tag = core.getInput('tag');
  const runCommand = core.getInput('run_command');
  const token = process.env.GITHUB_TOKEN;

  console.log(`Running tests with tag: ${tag}`);

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