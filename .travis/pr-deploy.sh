#!/usr/bin/env bash
set -e

if [[ "$TRAVIS_SECURE_ENV_VARS" != "true" ]]; then
    echo "Cannot deploy pull request without secure environment variables."
    exit 1
fi

branch=$TRAVIS_PULL_REQUEST
echo "Deploying PR #$branch"

git config --global user.name "Spongie"
git config --global user.email "Spongy@users.noreply.github.com"

# Clone git repository
git clone "https://spongy:$GH_TOKEN@github.com/Spongy/SpongeHome-PRs.git" dist/deploy >/dev/null

# Delete current version
rm -rf dist/deploy/$branch

# Copy new version
mkdir dist/deploy/$branch
cp -r dist/prod/* dist/deploy/$branch
cp -r public/assets dist/deploy/$branch

pushd dist/deploy

# Commit changes
git add -A
git commit -q -m "Deploy $(date)" &> /dev/null
git push -q &> /dev/null

popd

# Update preview comment on PR
pip install --user requests
python .travis/pr-comment.py
