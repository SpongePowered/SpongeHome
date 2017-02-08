import json
import os
import sys

import requests

comment_tpl = """
A preview for this pull request is available at %s/%s/.

Here are some links to the pages that were modified:

%s
"""


def mk_comment(pr, changes):
    return {'body': comment_tpl % (rawgit, pr, '\n'.join('- %s: %s/%s/%s' % (change['status'], rawgit, pr, change['filename']) for change in changes))}


pr = os.environ['TRAVIS_PULL_REQUEST']
token = os.environ['GH_TOKEN']

rawgit = 'https://spongy.github.io/SpongeHome-PRs'
repo = 'https://api.github.com/repos/SpongePowered/SpongeHome'


def map_change(change):
    filename = change['filename']
    filename = filename[len('src/html/'):filename.rfind('.')]
    if filename == 'index':
        filename = ''
    return {'filename': filename, 'status': change['status']}


def filter_change(change):
    filename = change['filename']
    status = change['status']
    return filename.startswith('src/html/') and filename.endswith('.html') and '/include/' not in filename and status in ['added', 'renamed', 'modified']

r = requests.get('%s/pulls/%s/files' % (repo, pr), auth=('x-oauth-basic', token))
r.raise_for_status()
files = r.json()

changes = [map_change(change) for change in files if filter_change(change)]
changes = [change for change in changes if change['status'] == 'added'] \
          + [change for change in changes if change['status'] == 'renamed'] \
          + [change for change in changes if change['status'] == 'modified']

comments = requests.get('%s/issues/%s/comments' % (repo, pr), auth=('x-oauth-basic', token)).json()
spongy_comments = [comment for comment in comments if comment['user']['login'] == 'Spongy']

if spongy_comments:
    # Use existing comment
    comment = spongy_comments[0]
else:
    # Post new comment
    payload = {'body': 'Setting up PR reference, please wait...'}
    r = requests.post(
        '%s/issues/%s/comments' % (repo, pr),
        auth=('x-oauth-basic', token),
        data=json.dumps(payload))
    r.raise_for_status()
    comment = r.json()

comment_id = comment['id']
r = requests.patch(
    '%s/issues/comments/%s' % (repo, comment_id),
    auth=('x-oauth-basic', token),
    data=json.dumps(mk_comment(pr, changes)))
r.raise_for_status()
