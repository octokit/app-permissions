const assert = require("assert");

const appPermissions = require("..");

assert("api.github.com" in appPermissions, 'export has "api.github.com" key');

const dotcomPermissions = appPermissions["api.github.com"];

assert(
  "permissions" in dotcomPermissions,
  '"api.github.com" export has "permissions" key'
);
assert("paths" in dotcomPermissions, '"api.github.com" export has "paths" key');

assert(
  "meta" in dotcomPermissions.permissions,
  '"permissions" export has "meta" key'
);
assert(
  typeof dotcomPermissions.paths["/"].GET === "object",
  '"paths" export has ["/"]["GET"] keys'
);

const metaPermission = dotcomPermissions.permissions.meta;
assert(Array.isArray(metaPermission.read), 'meta permission has "read" key');
assert(Array.isArray(metaPermission.write), 'meta permission has "write" key');

const rootPath = dotcomPermissions.paths["/"].GET;
assert(
  typeof rootPath.permission === "string",
  'rout path has "permission" key'
);
assert(typeof rootPath.access === "string", 'rout path has "access" key');

console.log("All tests passed");
