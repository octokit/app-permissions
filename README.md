# app-permissions

> machine-readable, always up-to-date GitHub App permissions

This repository is scraping the [Permissions required for GitHub Apps](https://docs.github.com/en/rest/reference/permissions-required-for-github-apps) app on an hourly basis and generates the [`generated/api.github.com.json`](generated/api.github.com.json) file.

## Usage

### Node.js

```js
const appPermissions = require('@octokit/app-permissions')

const createIssuePermissions = appPermissions['api.github.com'].paths['/repos/{owner}/{repo}/issues'].post
console.log(`Required app permissions to create an issue: %o`, createIssuePermissions)
```

### Download

All generated JSON files are uploaded as assets to each [GitHub release](https://github.com/octokit/app-permissions/releases)

## License

[MIT](LICENSE)