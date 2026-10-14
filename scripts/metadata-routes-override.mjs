/**
 * keep override until https://docs.github.com/en/rest/authentication/permissions-required-for-github-apps?apiVersion=2022-11-28#repository-permissions-for-metadata shows the correct content
 *
 * @see https://github.com/github/docs-content/issues/17117
 */

export default {
  override: true,
  name: "metadata",
  url: "https://docs.github.com/en/rest/authentication/permissions-required-for-github-apps?apiVersion=2022-11-28#metadata",
  routes: [
    {
      method: "GET",
      url: "/",
      access: "read",
    },
    {
      method: "GET",
      url: "/codes_of_conduct",
      access: "read",
    },
    {
      method: "GET",
      url: "/codes_of_conduct/{key}",
      access: "read",
    },
    {
      method: "GET",
      url: "/emojis",
      access: "read",
    },
    {
      method: "GET",
      url: "/events",
      access: "read",
    },
    {
      method: "GET",
      url: "/feeds",
      access: "read",
    },
    {
      method: "GET",
      url: "/gitignore/templates",
      access: "read",
    },
    {
      method: "GET",
      url: "/gitignore/templates/{key}",
      access: "read",
    },
    {
      method: "GET",
      url: "/licenses",
      access: "read",
    },
    {
      method: "GET",
      url: "/licenses/{key}",
      access: "read",
    },
    {
      method: "GET",
      url: "/meta",
      access: "read",
    },
    {
      method: "GET",
      url: "/networks/{owner}/{repo}/events",
      access: "read",
    },
    {
      method: "GET",
      url: "/organizations",
      access: "read",
    },
    {
      method: "GET",
      url: "/orgs/{org}",
      access: "read",
    },
    {
      method: "GET",
      url: "/orgs/{org}/events",
      access: "read",
    },
    {
      method: "GET",
      url: "/orgs/{org}/members",
      access: "read",
    },
    {
      method: "GET",
      url: "/orgs/{org}/members/{username}",
      access: "read",
    },
    {
      method: "GET",
      url: "/orgs/{org}/projects",
      access: "read",
    },
    {
      method: "GET",
      url: "/orgs/{org}/public_members",
      access: "read",
    },
    {
      method: "GET",
      url: "/orgs/{org}/public_members/{username}",
      access: "read",
    },
    {
      method: "GET",
      url: "/orgs/{org}/repos",
      access: "read",
    },
    {
      method: "GET",
      url: "/rate_limit",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/collaborators",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/collaborators/{username}",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/comments",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/comments/{comment_id}",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/comments/{comment_id}/reactions",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/commits/{sha}/comments",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/community/profile",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/contributors",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/events",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/events/issues",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/forks",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/languages",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/license",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/stargazers",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/stats/code_frequency",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/stats/commit_activity",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/stats/contributors",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/stats/participation",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/stats/punch_card",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/subscribers",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/tags",
      access: "read",
    },
    {
      method: "GET",
      url: "/repos/{owner}/{repo}/topics",
      access: "read",
    },
    {
      method: "GET",
      url: "/repositories",
      access: "read",
    },
    {
      method: "GET",
      url: "/search/code",
      access: "read",
    },
    {
      method: "GET",
      url: "/search/commits",
      access: "read",
    },
    {
      method: "GET",
      url: "/search/issues",
      access: "read",
    },
    {
      method: "GET",
      url: "/search/labels",
      access: "read",
    },
    {
      method: "GET",
      url: "/search/repositories",
      access: "read",
    },
    {
      method: "GET",
      url: "/search/topics",
      access: "read",
    },
    {
      method: "GET",
      url: "/search/users",
      access: "read",
    },
    {
      method: "GET",
      url: "/user/repos",
      access: "read",
    },
    {
      method: "GET",
      url: "/user/starred",
      access: "read",
    },
    {
      method: "GET",
      url: "/user/subscriptions",
      access: "read",
    },
    {
      method: "GET",
      url: "/users",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/events",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/events/public",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/followers",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/following",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/following/{target_user}",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/gpg_keys",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/keys",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/orgs",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/received_events",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/received_events/public",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/repos",
      access: "read",
    },
    {
      method: "GET",
      url: "/users/{username}/subscriptions",
      access: "read",
    },
    {
      method: "POST",
      url: "/markdown",
      access: "read",
    },
    {
      method: "POST",
      url: "/markdown/raw",
      access: "read",
    },
  ],
};
