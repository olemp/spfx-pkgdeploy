# spfx-pkgdeploy

Set up your `gulpfile.js` like this:

```javascript
'use strict';

const gulp = require('gulp');
const spfxPkgDeploy = require('spfx-pkgdeploy').default;
const build = require('@microsoft/sp-build-web');
const packageSolution = require('./config/package-solution.json');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

spfxPkgDeploy(build, packageSolution, {
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

*NOTE*: The reason `deleteAppPkg` is included in the npm `deploy` script is that we've experienced some issues with upgrading an app package without removing the app package file first. 
