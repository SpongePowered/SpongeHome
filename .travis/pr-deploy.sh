#!/usr/bin/env bash
set -e

if [[ "$TRAVIS_SECURE_ENV_VARS" != "true" ]]; then
    echo "Cannot deploy pull request without secure environment variables."
    exit 1
fi

branch=$TRAVIS_PULL_REQUEST
echo "Deploying PR #$branch"

# Copy assets
cp -r public/assets dist/prod

# Switch to target directory
pushd dist/prod

# Initialize new Git repository
git init
git config user.name "Spongie"
git config user.email "Spongy@users.noreply.github.com"
git remote add origin "https://spongy:$GH_TOKEN@github.com/Spongy/SpongeHome-PRs" >/dev/null

# Check if the branch already exists
if git ls-remote -h origin | grep -s "refs\/heads\/$branch$" &> /dev/null; then
    # Fetch branch from GitHub
    git fetch origin $branch
    # Create new branch that tracks the remote branch
    git branch $branch origin/$branch
    # Move HEAD to the new branch (but keep current working directory)
    git symbolic-ref HEAD refs/heads/$branch
else
    # Create a new branch for the PR
    git checkout --orphan $branch
fi

git add -A
git commit -q -m "Deploy $(date)" &> /dev/null
git push -q origin $branch &> /dev/null

# Get current commit for PR preview
commit=`git rev-parse --short HEAD`

popd

# Update preview comment on PR
pip install --user requests
python .travis/pr-comment.py "$commit"
