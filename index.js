const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const repo = core.getInput('repo');
    const eventType = core.getInput('event-type');
    const clientPayload = JSON.parse(core.getInput('client-payload'));

    const [owner, repoName] = repo.split('/');

    const octokit = github.getOctokit(core.getInput('repo-token'));

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
