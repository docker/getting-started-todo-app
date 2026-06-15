# 1-Week Sprint: Git, Docker, and a Real Codebase

**Repo:** Fork of [`docker/getting-started-todo-app`](https://github.com/docker/getting-started-todo-app)
**Goal:** Ship 4 features through PR review. Then rebuild the Compose stack solo.

---

## Setup

- You're added as contributors. Clone the repo directly.
- `main` is protected: PR required, 1 reviewer, no direct pushes, no force-pushes.
- Verify `docker compose up --watch` works. Flag if not.

---

## Start

- 1: Priority levels (low/med/high). DB column, API field, colored badge.
- 2: Due dates. DB column, validation, date picker, overdue styling.
- 3: Categories (work/personal/shopping). Enum column, filter dropdown.
- 4: Search + sort by created/priority/due. No schema, heavy UI edits.

You will all touch the same migration, API handler, and `TodoList` component. **Don't coordinate to avoid this.** Conflicts are the lesson.

**Review, merge, conflict.** PRs go up. You review someone else's before yours merges. Merge order = ready order. After the first merge, everyone else rebases and resolves their own conflicts. Delete merged branches.

**Rebuild the Compose stack solo.** New branch `compose/<name>`. Rename the existing `Dockerfile` and `compose.yaml` to `Dockerfile.example` and `compose.example.yaml`. Rebuild from scratch.

1-hour walkthrough, we cherry-pick the best ideas into a team `compose.yaml`.

---

## Rules

- No direct commits to `main`. No self-approving PRs.
- AI is encouraged but please try and use git and docker yourself.
- PR description: what changed, how to test, screenshot.
- Commit messages in imperative mood. "Add priority field," not "Added priority field."
- Clear and separated branches
- use feat/, fix/, etc branch conventions (https://conventional-branch.github.io/)

---

## What I'll review on your Compose stack

**Backend Dockerfile.** Multi-stage. Non-root. `npm install` shouldn't re-run on source-only changes. Healthcheck that proves the app is _up_, not just _alive_.

**Frontend Dockerfile.** Build stage produces static assets. Serve stage is tiny. No `node_modules` in the final image.

**compose.yaml.** Frontend, backend, db, phpMyAdmin. Backend doesn't start before the DB is _ready_. DB data survives `docker compose down`. No hardcoded secrets.

**Dev ergonomics.** One command to a working app with hot reload. `.env.example` tells me what I need without leaking yours.

---

## Deliverables (Friday EOD)

1. Merged feature PR.
2. `compose/<name>` branch.

---

## The existing stack is your starting point, not your target

The checked-in `compose.yaml` and `Dockerfile` work, but they fail parts of the rubric above on purpose. Keep them as `.example` files and read them. Your rebuild should beat them on at least:

- Containers run as root.
- Backend has no healthcheck. Compose has no way to know it's actually serving.
- Secrets are inline in `compose.yaml`. There is no `.env.example`.
- One Dockerfile builds both client and backend, and the prod client is baked into the backend image. Split them. The frontend should build to static assets and be served by something that isn't Node.

---

## Hints (not answers)

- `git rebase` and `git merge` solve the same problem differently. Pick one. Know why.
- `git pull --rebase` saves you unnecessary merge commits.
- Layers that change often go _after_ layers that don't.
- `depends_on` alone doesn't wait for a DB to be ready. Look up `condition`.
- `COPY package*.json ./` before `COPY . .`. There's a reason.
- A static site doesn't need a Node runtime to be served. `nginx:alpine` is ~50MB.
- A container running as root is one `USER` line away from not being.
- `mysqladmin ping` proves MySQL is alive. What proves your API is _serving_?
- `env_file:` and `${VAR}` substitution exist for a reason. So does `.env.example`.
