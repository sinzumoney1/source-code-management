# Task 1: Evaluate Different SCM Tools
**Start by comparing centralized and distributed version control systems. What are the key differences between tools like Subversion (SVN) and Git?**

SVN = centralized: single central repository; clients check out/commit to that server. Good for simpler linear workflows and for some large-binary / legacy workflows. 

Git = distributed: every developer has a full copy of the repo (history + branches) locally; branching, merging and offline work are first-class. Dominant for modern software teams and open source.

Key differences (bite-sized)

Architecture

SVN: single central server stores history; clients operate against it. 


Git: every clone is a full repository with history; pushes/pulls between repos. 


Local work & offline capabilities

SVN: must contact server for many operations (log, commits, history).

Git: almost everything (commits, diffs, branch work, history browsing) works offline. Great for flaky networks. 


Branching & merging

SVN: branching is heavier (branches stored on server as directory), merges work but are less cheap.

Git: branching is cheap and fast; encourages feature-branch workflows and frequent local commits. 

**Evaluate the advantages and challenges of using Git in a distributed environment over a centralized system like SVN or Mercurial.**

**Advantages of git in a distributed environment**
1. Offline Workflows
2. Fast Branching & Merging
3. Resilience & Redundancy

**Challenges of Git in a distributed environment**

1.Learning Curve

2.Repository Size & Large Files


3.History Rewrites & Complexity


# Task 2: Implement Git Workflows for a Team Project
**Assume the team is developing a new web application. Developers need to work on multiple features simultaneously while maintaining a stable main branch.**

1.Feature branching

2.Pull requests for code reviews

3.Integration testing before merging code into the main branch

#### Branching Strategy

Main Branch (main)

*Always stable, production-ready.

*Protected: no direct commits, only merges via reviewed PRs.

**Develop Branch** (develop) (optional)

Integration branch where features are first merged and tested before going into main.

Useful for bigger teams; smaller teams may merge features directly into main.

**Feature Branches** (feature/<name>)

Created from main (or develop).

Used for developing individual features, bug fixes, or experiments.

Naming convention

``feature/login-auth``

`feature/shopping-cart`

``bugfix/form-validation``




# Task 3: Automate Code Quality and Deployment
Runs unit tests automatically.

Checks code quality (linting).

Deploys changes to a staging environment when tests and lint checks pass.

Is fully documented so your team knows how to use it.

📄 GitHub Actions CI/CD Pipeline Documentation
1. Pipeline Overview

This CI/CD pipeline ensures:

Every push to a feature branch → runs lint + tests.

Every pull request into main → runs lint + tests before merge.

Merges into main → deploy automatically to staging environment.

2. Workflow File

Save this as .github/workflows/ci-cd.yml in your repository:

name: CI/CD Pipeline

on:
  push:
    branches:
      - 'feature/*'
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      # Step 1: Checkout repository
      - name: Checkout code
        uses: actions/checkout@v3

      # Step 2: Setup Node.js (example for a web app)
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      # Step 3: Install dependencies
      - name: Install dependencies
        run: npm ci

      # Step 4: Lint check (code quality)
      - name: Run lint
        run: npm run lint

      # Step 5: Run unit tests
      - name: Run unit tests
        run: npm test -- --coverage

  deploy-to-staging:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    steps:
      # Step 1: Checkout code
      - name: Checkout code
        uses: actions/checkout@v3

      # Step 2: Deploy (example: Docker + staging server via SSH)
      - name: Deploy to staging
        env:
          SSH_HOST: ${{ secrets.STAGING_HOST }}
          SSH_USER: ${{ secrets.STAGING_USER }}
          SSH_KEY: ${{ secrets.STAGING_KEY }}
        run: |
          echo "$SSH_KEY" > deploy_key.pem
          chmod 600 deploy_key.pem
          ssh -i deploy_key.pem -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "
            cd /var/www/app &&
            git pull origin main &&
            npm install &&
            pm2 restart app
          "

# task 4.Enforce Security Best Practices
Git Repository Security Best Practices
1. User Access Controls
Configuration

Principle of Least Privilege (PoLP):

Developers get the minimum access needed.

Example: junior devs = read/write on feature branches only; leads = merge rights.

Role-based access (via GitHub/GitLab/Bitbucket):

Admin: Full control (rare, only repo maintainers).

Maintainer/Lead: Can approve merges, manage branches.

**How it helps**

Prevents unauthorized or accidental code changes.

Limits blast radius if a developer account is compromised.

**Enforcing signed commits**

 Configuration

Generate a GPG key (for signing commits):

```python
gpg --full-generate-key
gpg --list-secret-keys --keyid-format LONG
git config --global user.signingkey <YOUR_KEY_ID>
git config --global commit.gpgsign true

```

# Task 5: Handle a Real-World Git Challenge
**ConflicMerge t Resolution & Workflow Improvement**
1. Resolving the Merge Conflict
Step 1: Pull the latest changes from main


```python
git checkout main
git pull origin main
```
**Step 2: Switch to your feature branch and update it**
```python
git checkout feature/login-auth
git pull origin main
```


At this point, Git may show a merge conflict if the branch and main modified the same files/lines.

**Step 3: Identify conflicting file**s

Run:

```python
git status
```


Output example:

both modified: src/components/LoginForm.js
both modified: src/styles/form.css

**Step 4: Resolve conflicts manually**

Open the files listed. Git marks conflicts like this:
```python

<<<<<<< HEAD
<div class="login-box">Old code from main</div>
=======
<div class="auth-container">New code from feature branch</div>
>>>>>>> feature/login-auth
```


👉 Choose the correct code (or merge them manually), then remove the conflict markers (<<<<<<<, =======, >>>>>>>).

**Step 5: Mark as resolved**

```python
git add src/components/LoginForm.js src/styles/form.css
git commit -m "Resolve merge conflicts between feature/login-auth and main"
```

**Step 6: Push resolved branch**


```python
git push origin 
feature/login-aut
```



If merging directly to main:


```python
git checkout main
git merge feature/login-auth
git push origin main
```

2. Preventing Future Conflicts

To minimize merge conflicts, update the team’s Git workflow with these practices:

✅ Smaller, Frequent Pull Requests

Long-lived branches drift from main, increasing conflicts.

Merge often with small, reviewable PRs (1–3 days max).

✅ Communicate Ownership of Files

If two developers are editing the same module, discuss changes beforehand.

Use standups or Slack to coordinate.

✅ Rebase Frequently

Before opening a PR, rebase onto the latest main:

git fetch origin
git rebase origin/main


Keeps history linear and reduces late surprises.

✅ Enforce Branch Protection

Require PRs to be up-to-date with main before merging.

Enable “Require branch to be up-to-date before merging” in GitHub/GitLab.

✅ Automated CI/CD Tests

Run lint + unit/integration tests on every PR.

Blocks merging if tests fail after conflict resolution.

📄 Deliverable Summary
Conflict Resolution Steps

Pulled latest code from main.

Identified conflicting files with git status.

Resolved conflicts manually in source files.
