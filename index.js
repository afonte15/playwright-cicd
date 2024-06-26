const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const repo = core.getInput('repo');
    const eventType = core.getInput('event-type');
    const clientPayload = JSON.parse(core.getInput('client-payload'));

    const [owner, repoName] = repo.split('/');
    const repoToken = process.env.GITHUB_TOKEN;


    if (!repoToken) {
      throw new Error('GITHUB_TOKEN is not available in the environment');
    }

    // Logging for debugging purposes
    core.info(`repo: ${repo}`);
    core.info(`eventType: ${eventType}`);
    core.info(`clientPayload: ${JSON.stringify(clientPayload)}`);
    core.info(`repoToken: ${repoToken ? 'available' : 'not available'}`);
    core.info(`owner: ${owner}`);
    core.info(`repoName: ${repoName}`);

    const octokit = github.getOctokit(repoToken);

    const response = await octokit.rest.repos.createDispatchEvent({
      owner,
      repo: repoName,
      event_type: eventType,
      client_payload: clientPayload
    });

    // Set output for the dispatched event
    core.setOutput('response', `Dispatched event ${eventType} to ${repo}`);

    core.info(`Dispatched event ${eventType} to ${repo}`);
    core.info(`Response: ${JSON.stringify(response)}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
