#  Task 1: Evaluate Different SCM Tools
*The key differences between SVN and GIT*
1. Architecture & Repository Model
   
   SVN (CVCS):

[+]Single central repositogry on a server.

[+]Developers check out a working copy and commit changes directly to the central server.

[+]No full history on developer machines.

Git (DVCS):

[+]Every developer has a full clone of the repository, including complete history and branches.

[+]Developers can commit locally, then push/pull changes to/from a shared remote (like GitHub/GitLab).


*The advantages and challenges of using Git in a distributed environment over a centralized system like SVN or Mercurial.*
1. Offline Capabilities

Git: Developers have the full repo and history locally → commits, diffs, logs, branching, and merging work offline.

SVN: Requires server connection for most operations.

Why it matters: Distributed teams across regions (with varied internet quality) can keep working productively.

2. Branching & Merging

Git: Branching is cheap and merges are optimized. Supports modern workflows (feature branching, trunk-based dev, GitHub Flow, Git Flow).

SVN: Branches exist but are cumbersome (implemented as directory copies). Merging often leads to conflicts and pain.

Why it matters: Enables parallel development across distributed teams without stepping on each other.


*Here are the key reasons why my team should move to Git or an alternative DVCS.*

Transitioning from SVN to Git will modernize our software development process, improve collaboration across distributed teams, and integrate seamlessly with DevOps practices. While the migration requires training and process updates, the long-term benefits in scalability, productivity, and resilience far outweigh the challenges.



# Task 2: Implementing a Git Workflow for the Team Project
Here’s a practical Git workflow that implements feature branching, pull requests for code reviews, and integration testing before merging into the main branch.

*step 1: Create a Feature Branch*
        

```bash
git checkout develop
git pull origin develop
git checkout -b feature/login-api
```
*Step 2: Commit Changes*
```bash
git add .
git commit -m "Add login API endpoint with JWT authentication"
```

*Step 3: Push and Open a Pull Request (PR)*  
bash
git push origin feature/login-api

Open a PR into develop (or main for small teams).

Add reviewers from your team.

Ensure the PR description explains what and why, not just how.

*Step 4: Automated Testing*    
CI pipeline runs unit and integration tests on every PR.

PR cannot be merged until tests pass.

*Step 5: Code Review*

At least one peer review approval required.

Reviewers check: code style, functionality, tests, and documentation.

*Step 6: Merging*   
Use Squash and Merge for clean history (one commit per feature).

Use Rebase to keep a linear history when syncing feature branches with develop
 bash
# Example: rebasing feature branch with latest develop
```bash
git checkout feature/login-api
git fetch origin
git rebase origin/develop
```


# Task 3: Automate Code Quality and Deployment
Implementing a CI/CD pipeline using Git integration
*Workflow File* (`.github/workflows/ci-cd.yml`)
```bash
name: CI/CD Pipeline

on:
  pull_request: { branches: [develop, main] }
  push: { branches: [develop, main] }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "18" }
      - run: npm install
      - run: npm test

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "18" }
      - run: npm install
      - run: npm run lint

  staging-deploy:
    if: github.ref == 'refs/heads/develop'
    needs: [test, lint]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to staging..."

  production-deploy:
    if: github.ref == 'refs/heads/main'
    needs: [test, lint]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production..."
```
3. How It Works

Push/PR → develop: run tests, lint, then deploy to staging.

Push/PR → main: run tests, lint, then deploy to production.

4. Usage

Create feature branch → push → tests/lint run.

Open PR → develop → deploys to staging.

Merge develop → main → deploys to production.



# Task 4: Enforce Security Best Practices
Git Repository Security Best Practices

*1. Access Controls*

Team-based permissions: Developers were added to GitHub organization teams with least-privilege roles (read, write, maintain, admin).

2FA enforced: All contributors must enable two-factor authentication.

Service accounts: CI/CD and automation use restricted deploy keys or GitHub App tokens instead of personal accounts.

👉 This ensures only authenticated, authorized users can access and modify the repository.

*2. Branch Protection Rules*

Protected branches: main and develop are protected from direct pushes.

Pull requests required: All code must go through a PR before merging.

Required status checks: Unit tests, linting, and security scans must pass before merge.

Review enforcement: At least 1–2 approvals are required. Sensitive areas use CODEOWNERS.

No force pushes or deletions are allowed on protected branches.

👉 This prevents unauthorized or unreviewed changes from entering critical branches.

*3. Commit Signing*

Developers are required to use GPG or SSH-signed commits.

Branch rules enforce “Require signed commits” on main and develop.

CI checks run to verify that all commits in a PR are signed before merging.

👉 This guarantees authenticity of commits and makes it impossible to spoof an identity in the commit history.

*4. Audit & Traceability*

Git history: Immutable commit logs track every change (author, date, diff).

Pull request history: Documents discussions, approvals, and linked issues.

CI/CD logs: Record which commit was built, tested, and deployed.

Org audit logs: Track access changes, repo settings changes, and force-push attempts.


# Task 5: Handle a Real-World Git Challenge
Here is a demonstration on how to Resolve Merge Conflicts & Updating Git Workflow

*1. Pull the latest code from* `main` 

 bash
git checkout main
git pull origin main

*2. Try merging the feature branch*

bash
git checkout feature-branch
git merge main

*3. Identify conflicting files*

``git status
``

Conflicting files will be shown like:
bash
both modified: src/app.js
both modified: src/utils/helpers.js

*4. Resolve conflicts manually*
Open the conflicting files — you’ll see conflict markers:
bash
<<<<<<< HEAD
Code from main
=======
Code from feature-branch
>>>>>>> feature-branch

Choose the correct version, or combine both.

Remove the conflict markers (<<<<<<<, =======, >>>>>>>).

*5. Mark conflicts as resolved and commit*
bash
git add src/app.js src/utils/helpers.js
git commit -m "Resolved merge conflicts between main and feature-branch"

*6. Push the fixed branch and merge into main*
bash
git checkout main
git merge feature-branch
git push origin main

The conflict is now resolved, and code is safely merged.

## Updating the Team Workflow to Prevent Future Conflicts
*1.Smaller, more frequent pull requests*

Don’t wait weeks to merge. Short-lived branches reduce conflict chances.

*2.Better communication*

Developers announce when they’re modifying the same file/module.

Daily standups or Slack/GitHub issue updates help avoid overlap.

*3.Regular syncing with main or develop*
bash
git fetch origin
git rebase origin/main


Keeps branches up to date and surfaces conflicts earlier.

*4.Enforce branch protection*

No direct pushes to main.

Require pull requests + passing tests before merge.

*5.Code review*

At least one reviewer must approve changes before merging.

Use CODEOWNERS to enforce reviews on critical files.