const { writeFileSync, readFileSync } = require("fs");

const cheerio = require("cheerio");
const got = require("got");
const minimist = require("minimist");
const prettier = require("prettier");

const PERMISSIONS_DOCUMENTATION_URL =
  "https://docs.github.com/en/free-pro-team@latest/rest/reference/permissions-required-for-github-apps/";
const CACHE_FILE_PATH = "cache/api.github.com.html";
const GENERATED_JSON_FILE_PATH = "generated/api.github.com.json";
const DOCUMENTED_BASE_URL = "https://docs.github.com";

update(minimist(process.argv.slice(2))).catch(console.error);

async function update(options) {
  const updateCached = !options.cached;

  if (updateCached) {
    const { body } = await got(PERMISSIONS_DOCUMENTATION_URL);
    const $ = cheerio.load(body);

    // get only the HTML we care about to avoid unnecessary cache updates
    const html = $("#article-contents").html();

    // format the html to avoid unnecessary cache updates
    const formattedHtml = prettier.format(html, { parser: "html" });
    writeFileSync(CACHE_FILE_PATH, formattedHtml);
    console.log("%s written", CACHE_FILE_PATH);
  }

  const html = readFileSync(CACHE_FILE_PATH, "utf-8");
  const $ = cheerio.load(html);

  const result = $("h3")
    .slice(1)
    .map((i, el) => {
      $el = $(el);
      const name = toPermissionName($el.text().trim());
      const url = `${PERMISSIONS_DOCUMENTATION_URL}#${$el.attr("id")}`;
      const routes = $(el)
        .nextUntil("h3", "ul")
        .find("li")
        .map((i, el) => {
          const documentationUrl =
            DOCUMENTED_BASE_URL + $(el).find("a").attr("href");
          const { method, url, access } = getRouteAndAccess($(el).text());

          return {
            method,
            // replace :varname with {varname} to make it RFC 6570 compatible
            // and coherent with current docs
            // NOTE: this workaround can be removed once URLs in the docs use {varname}
            url: url.replace(/:([a-z]\w+)/g, "{$1}"),
            access,
            documentationUrl,
          };
        })
        .get();

      return { name, url, routes };
    })
    .get();

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
    prettier.format(
      JSON.stringify({
        permissions,
        paths,
      }),
      { parser: "json" }
    )
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

  const matches = accessString.match(/\(:(.*)\)$/);
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
    { read: [], write: [] }
  );
}
