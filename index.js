const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const repo = core.getInput('repo');
    const eventType = core.getInput('event-type');
    const clientPayload = JSON.parse(core.getInput('client-payload'));
    const repoToken = process.env.GITHUB_TOKEN;

    if (!repoToken) {
      throw new Error('GITHUB_TOKEN is not available in the environment');
    }

    core.info(`repo: ${repo}`);
    core.info(`eventType: ${eventType}`);
    core.info(`clientPayload: ${JSON.stringify(clientPayload)}`);
    core.info(`repoToken: ${repoToken ? 'available' : 'not available'}`);

    const [owner, repoName] = repo.split('/');

    core.info(`owner: ${owner}`);
    core.info(`repoName: ${repoName}`);

    const octokit = github.getOctokit(repoToken);

    const response = await octokit.rest.actions.createWorkflowDispatch({
      owner,
      repo: repoName,
      workflow_id: eventType,
      ref: 'main',
      inputs: clientPayload
    });

    core.info(`Dispatched event ${eventType} to ${repo}`);
    core.info(`Response: ${JSON.stringify(response)}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
