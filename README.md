# spfx-pkgdeploy

Set up your `gulpfile.js` like this:

```javascript
'use strict';

const gulp = require('gulp');
const spfxPkgDeploy = require('spfx-pkgdeploy').default;
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

spfxPkgDeploy(build, {
    username: "",
    password: "",
    tenant: "",
    catalogSite: ""
});

build.initialize(gulp);
```

Then add a new task to your `package.json` called `deploy`:

`gulp clean && gulp default --ship && gulp deleteAppPkg --ship && gulp package-solution --ship && gulp uploadAppPkg --ship && gulp deploySppkg --ship`

Like this:

```json
{
  "scripts": {
    "build": "gulp bundle",
    "clean": "gulp clean",
    "test": "gulp test",
    "deploy": "gulp clean && gulp default --ship && gulp deleteAppPkg --ship && gulp package-solution --ship && gulp uploadAppPkg --ship && gulp deploySppkg --ship"
  }
}
```