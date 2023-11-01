import assert from "assert";

import appPermissions from "../index.js";

assert("api.github.com" in appPermissions, 'export has "api.github.com" key');

const dotcomPermissions = appPermissions["api.github.com"];

assert(
  "permissions" in dotcomPermissions,
  '"api.github.com" export has "permissions" key',
);
assert("paths" in dotcomPermissions, '"api.github.com" export has "paths" key');

assert(
  "metadata" in dotcomPermissions.permissions,
  '"permissions" export has "metadata" key',
);
assert(
  typeof dotcomPermissions.paths["/"].GET === "object",
  '"paths" export has ["/"]["GET"] keys',
);

const metaPermission = dotcomPermissions.permissions.metadata;
assert(
  Array.isArray(metaPermission.read),
  'metadata permission has "read" key',
);
assert(
  Array.isArray(metaPermission.write),
  'metadata permission has "write" key',
);

const rootPath = dotcomPermissions.paths["/"].GET;
assert(
  typeof rootPath.permission === "string",
  'rout path has "permission" key',
);
assert(typeof rootPath.access === "string", 'rout path has "access" key');

console.log("All tests passed");
