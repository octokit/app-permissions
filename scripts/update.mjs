import { writeFileSync, readFileSync } from "fs";

import { fromURL as loadFromURL, load } from "cheerio";
import minimist from "minimist";
import * as prettier from "prettier";
import sortKeys from "sort-keys";

const PERMISSIONS_DOCUMENTATION_URL =
  "https://docs.github.com/en/free-pro-team@latest/rest/reference/permissions-required-for-github-apps/";
const PERMISSIONS_DOCUMENTATION_CACHE_FILE_PATH = "cache/api.github.com.html";
const APP_PERMISSIONS_SCHEMA_CACHE_FILE_PATH =
  "cache/app-permissions-schema.json";
const GENERATED_JSON_FILE_PATH = "generated/api.github.com.json";
const DOCUMENTED_BASE_URL = "https://docs.github.com";

// TODO: these should be added to GitHub's OpenAPI schema
const MISSING_SCHEMA_PERMISSIONS = [
  "codespaces",
  "dependabot_secrets",
  "email_addresses",
  "followers",
  "git_ssh_keys",
  "gpg_keys",
  "interaction_limits",
  "organization_events",
  "organization_webhooks",
  "profile",
  "repository_webhooks",
  "self_hosted_runners",
  "starring",
];
const KNOWN_PERMISSIONS_MAPPING = {
  blocking_users: "organization_user_blocking",
  code_scanning_alerts: "security_events",
  commit_statuses: "statuses",
  dependabot_alerts: "vulnerability_alerts",
};

update(minimist(process.argv.slice(2))).catch(console.error);

async function update(options) {
  const updateCached = !options.cached;

  if (updateCached) {
    // update documentation cache
    const $ = await loadFromURL(PERMISSIONS_DOCUMENTATION_URL);

    // get only the HTML we care about to avoid unnecessary cache updates
    const html = $("#article-contents").html();

    // format the html to avoid unnecessary cache updates
    const formattedHtml = await prettier.format(html, { parser: "html" });
    writeFileSync(PERMISSIONS_DOCUMENTATION_CACHE_FILE_PATH, formattedHtml);
    console.log("%s written", PERMISSIONS_DOCUMENTATION_CACHE_FILE_PATH);

    // update app permissions schema cache
    let ref;
    if (process.env.OCTOKIT_OPENAPI_VERSION) {
      console.log(
        `\`OCTOKIT_OPENAPI_VERSION\` is set: using OpenAPI version ${process.env.OCTOKIT_OPENAPI_VERSION}`,
      );
      ref = process.env.OCTOKIT_OPENAPI_VERSION;
    } else {
      console.log(
        "`OCTOKIT_OPENAPI_VERSION` is not set: using latest OpenAPI version",
      );
      ref = "main";
    }
    const openapiSchemaUrl = `https://raw.githubusercontent.com/octokit/openapi/${ref}/generated/api.github.com.json`;

    const req = await fetch(openapiSchemaUrl);
    const openApiSchema = await req.json();

    const appPermissionsSchema =
      openApiSchema.components.schemas["app-permissions"];
    const formattedJson = await prettier.format(
      JSON.stringify(appPermissionsSchema),
      {
        parser: "json-stringify",
      },
    );
    writeFileSync(APP_PERMISSIONS_SCHEMA_CACHE_FILE_PATH, formattedJson);

    console.log("%s written", APP_PERMISSIONS_SCHEMA_CACHE_FILE_PATH);
  }

  const html = readFileSync(PERMISSIONS_DOCUMENTATION_CACHE_FILE_PATH, "utf-8");
  const $ = load(html);
  const appPermissionsSchema = JSON.parse(
    readFileSync(APP_PERMISSIONS_SCHEMA_CACHE_FILE_PATH, "utf-8"),
  );
  const knownAppPermissions = Object.entries(
    appPermissionsSchema.properties,
  ).reduce((acc, [permissionName, schema]) => {
    return {
      ...acc,
      [permissionName]: schema.enum,
    };
  }, {});

  const result = $("h2")
    .slice(1)
    .map((i, el) => {
      const $el = $(el);
      const title = toPermissionName($el.text().trim());
      const name = KNOWN_PERMISSIONS_MAPPING[title] || title;

      if (MISSING_SCHEMA_PERMISSIONS.includes(name)) {
        return;
      }

      if (!knownAppPermissions[name]) {
        throw new Error(`Unknown permission: ${name}`);
      }

      const url = `${PERMISSIONS_DOCUMENTATION_URL}#${$el.attr("id")}`;
      const routes = $(el)
        .nextUntil("h2")
        .find("td:first-child")
        .map((i, el) => {
          const documentationUrl =
            DOCUMENTED_BASE_URL + $(el).find("a").attr("href");
          const { method, url, access } = getRouteAndAccess($(el).text());

          return {
            method,
            url,
            access,
            documentationUrl,
          };
        })
        .get();

      return { name, url, routes };
    })
    .get()
    .filter(Boolean);

  const permissions = result.reduce((map, { name, url, routes }) => {
    map[name] = {
      url,
      ...toPermissionsObject(routes),
    };

    return map;
  }, {});

  const paths = result.reduce((map, { name, url, routes }) => {
    for (const { method, url, access } of routes) {
      if (!map[url]) {
        map[url] = {};
      }

      map[url][method] = {
        permission: name,
        access,
      };
    }

    return map;
  }, {});

  writeFileSync(
    GENERATED_JSON_FILE_PATH,
    await prettier.format(
      JSON.stringify(
        sortKeys(
          {
            permissions,
            paths,
          },
          { deep: true },
        ),
      ),
      { parser: "json" },
    ),
  );
  console.log("%s written", GENERATED_JSON_FILE_PATH);
}

function getRouteAndAccess(rawText) {
  // normalize whitestpace
  const text = normalize(rawText);

  const [method, url, accessString] = text.split(" ");

  return {
    method,
    url,
    access: getAccess(rawText.replace(/\s+ /g, " ").trim(), accessString),
  };
}

function getAccess(text, accessString) {
  if (!accessString) return "read";

  const matches = accessString.match(/\((read|write)\)$/);
  if (!matches) {
    throw new Error(`Invalid string: ${text}`);
  }

  return matches.pop();
}

function normalize(rawText) {
  return rawText.replace(/\s+ /g, " ").trim();
}

function toPermissionName(text) {
  if (text === "Metadata permissions") {
    return "meta";
  }

  const title = text.match(/"([^"]+)"/).pop();

  return title.toLowerCase().replace(/\W/g, "_");
}

function toPermissionsObject(paths) {
  return paths.reduce(
    (map, route) => {
      map[route.access] = map[route.access]
        .concat([route.method, route.url].join(" "))
        .sort();

      return map;
    },
    { read: [], write: [] },
  );
}
