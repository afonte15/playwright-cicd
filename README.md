# playwright-cicd
A GitHub Actions repository for automating the execution of Playwright tests across multiple project repositories. This repository supports CI/CD workflows, ensuring that all tagged tests are run and verified before code merges.

##  How to Use

### 1. Fork this Repository (Optional)
Fork this repository to your GitHub account if you want to customize the workflow. Otherwise, you can use it directly.

### 2. Set Up Secrets
Add any required secrets in your repository under `Settings > Secrets and variables > Actions`. For example, add a `GITHUB_TOKEN` secret if needed.

### 3. Integrate with Your Project Repositories
In each of your project repositories, create a `.github/workflows/dispatch.yml` file with the following content:

```
name: Dispatch Playwright Tests

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  dispatch-playwright-tests:
    uses: afonte15/playwright-cicd@main
    with:
      tag: 'tagNames'  # Tag to filter the tests
      playwright_repo: 'yourusername/playwright-automation'  # Playwright Automation Repository
      playwright_repo_ref: 'main'  # Branch or commit to use
      run_command: 'npx playwright test'  # Command to run the Playwright tests - adjust as needed
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} - if needed


```