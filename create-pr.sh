#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# create-pr.sh — push this repository to GitHub and open (then merge) a PR.
#
#   This repository is already fully merged, so there is normally no diff to
#   review. The script refuses to open an empty PR — commit a follow-up change
#   on a feature branch first, or pass --force to open a PR anyway.
#
# Usage
#   ./create-pr.sh <owner/repo> <branch> [--merge] [--force]
#
#   ./create-pr.sh hossein/portfolio feature/content-update --merge
#
# Authentication (one of)
#   • gh CLI logged in:            gh auth login
#   • or a token in the env:       export GH_TOKEN=ghp_xxx
#   • or SSH key / credential helper configured for git push
#
# Requires: git, bash, and either gh (recommended) or a configured remote+creds.
# ---------------------------------------------------------------------------
set -euo pipefail

REPO=""
BRANCH=""
DO_MERGE=0
FORCE=0
BASE="${BASE_BRANCH:-main}"

usage() { sed -n '2,25p' "$0" | sed 's/^# \{0,1\}//'; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --merge) DO_MERGE=1 ;;
    --force) FORCE=1 ;;
    -h|--help) usage ;;
    -*) echo "Unknown option: $1" >&2; usage ;;
    *)
      if   [[ -z "$REPO" ]];   then REPO="$1"
      elif [[ -z "$BRANCH" ]]; then BRANCH="$1"
      else echo "Unexpected argument: $1" >&2; usage
      fi ;;
  esac
  shift
done

[[ -n "$REPO" && -n "$BRANCH" ]] || usage

die() { echo "✗ $*" >&2; exit 1; }
info() { echo "→ $*"; }

# ---------------------------------------------------------------- pre-flight
cd "$(dirname "$0")"

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Not a git repository."

if [[ -n "$(git status --porcelain)" ]]; then
  die "Working tree is dirty. Commit or stash your changes first."
fi

git show-ref --verify --quiet "refs/heads/$BASE" || die "Base branch '$BASE' not found."
git show-ref --verify --quiet "refs/heads/$BRANCH" \
  || die "Branch '$BRANCH' not found. Create it first: git checkout -b $BRANCH"

if [[ "$BRANCH" == "$BASE" ]]; then
  die "Branch and base are both '$BASE'. A PR needs a separate head branch."
fi

# Compare against the remote base when it exists: local main may have diverged
# (e.g. a profile repo where local history is unrelated to the remote's).
git fetch -q origin "$BASE" 2>/dev/null || true
if git rev-parse --verify --quiet "origin/$BASE" >/dev/null; then
  COMPARE_BASE="origin/$BASE"
else
  COMPARE_BASE="$BASE"
fi

AHEAD="$(git rev-list --count "$COMPARE_BASE..$BRANCH")"
if [[ "$AHEAD" -eq 0 && "$FORCE" -ne 1 ]]; then
  cat >&2 <<EOF
✗ '$BRANCH' has no commits ahead of '$BASE' — GitHub will reject this PR
  ("No commits between $BASE and $BRANCH"), because the work is already merged.

  Options:
    1. Commit a real follow-up change on '$BRANCH', then re-run this script.
    2. Re-run with --force to open a PR anyway (it will show as closed/merged).

  Check with:  git log --oneline $COMPARE_BASE..$BRANCH
EOF
  exit 1
fi

command -v gh >/dev/null 2>&1 || cat <<'EOF'
! gh CLI not found. The script will push branches, but you will need to open
  the PR in the browser. Install gh: https://cli.github.com/
EOF

# -------------------------------------------------------------------- remote
if ! git remote get-url origin >/dev/null 2>&1; then
  info "Adding remote origin → $REPO"
  if [[ "$REPO" == http* || "$REPO" == git@* ]]; then
    git remote add origin "$REPO"
  else
    git remote add origin "https://github.com/$REPO.git"
  fi
else
  info "Remote origin already set: $(git remote get-url origin)"
fi

# ---------------------------------------------------------------------- push
# Push the base only if the remote doesn't have it yet; never overwrite it.
if ! git rev-parse --verify --quiet "origin/$BASE" >/dev/null; then
  info "Pushing '$BASE' (not yet on remote)…"
  git push -u origin "$BASE"
else
  info "Remote already has '$BASE' — not pushing it."
fi

info "Pushing '$BRANCH'…"
git push -u origin "$BRANCH"

# ------------------------------------------------------------------------ pr
if command -v gh >/dev/null 2>&1; then
  gh auth status >/dev/null 2>&1 || die "gh is installed but not authenticated. Run: gh auth login"

  BODY_ARGS=()
  if [[ -f PR_DESCRIPTION.md ]]; then
    BODY_ARGS=(--body-file PR_DESCRIPTION.md)
  else
    BODY_ARGS=(--body "Add placeholder portfolio site for Dr Hossein Mohammadifar.")
  fi

  if TITLE="$(gh pr view "$BRANCH" --json title -q .title 2>/dev/null)"; then
    info "A PR for '$BRANCH' already exists: $TITLE"
  else
    info "Creating pull request…"
    gh pr create --base "$BASE" --head "$BRANCH" \
      --title "Add placeholder portfolio site for Dr Hossein Mohammadifar" \
      "${BODY_ARGS[@]}"
  fi

  if [[ "$DO_MERGE" -eq 1 ]]; then
    info "Merging pull request…"
    gh pr merge "$BRANCH" --merge --delete-branch
    info "Merged and remote branch deleted. Locally: git checkout $BASE && git pull && git branch -d $BRANCH"
  fi
else
  echo
  echo "Open a PR here:"
  echo "  https://github.com/${REPO%/}/compare/$BASE...$BRANCH?expand=1"
fi
