# app-permissions

> machine-readable, always up-to-date GitHub App permissions

This repository is scraping the [Permissions required for GitHub Apps](https://docs.github.com/en/rest/reference/permissions-required-for-github-apps) app on an hourly basis and generates the [`generated/api.github.com.json`](generated/api.github.com.json) file.

## Usage

The structure of the JSON export looks like this

```
permissions
  api.github.com
    permissions
      [name of permission]
        url # documentation URL
        read # array of routes with read access
        write # array of routes with write access
    paths
      [http path]
        [http method]
          permission # name of permission
          access # "read" or "write"
```

### Node.js

```js
const appPermissions = require("@octokit/app-permissions");

const createIssuePermissions =
  appPermissions["api.github.com"].paths["/repos/{owner}/{repo}/issues"].post;
console.log(
  `Required app permissions to create an issue: %o`,
  createIssuePermissions
);

const issuesPermission = appPermissions["api.github.com"].permissions.issues;
console.log(`"issues" read access paths: %o`, issuesPermission.read);
console.log(`"issues" write access paths: %o`, issuesPermission.write);
```

### Download

All generated JSON files are uploaded as assets to each [GitHub release](https://github.com/octokit/app-permissions/releases)

## See also

- [octokit/graphql-schema](https://github.com/octokit/graphql-schema) – GitHub’s GraphQL Schema with validation
- [octokit/openapi](https://github.com/octokit/openapi) – GitHub REST API route specifications
- [octokit/webhooks](https://github.com/octokit/webhooks) – GitHub Webhooks specifications

## License

[MIT](LICENSE)
