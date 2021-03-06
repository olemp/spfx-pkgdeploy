const gulp = require('gulp');
const spsync = require('gulp-spsync-creds').sync;
const sppkgDeploy = require('node-sppkg-deploy');
const { default: pnp, Web } = require('sp-pnp-js');
const NodeFetchClient = require('node-pnp-js').default;

function initSpfxPkgDeploy(build, packageSolution, environment) {
    pnp.setup({
        sp: {
            fetchClientFactory: () => {
                return new NodeFetchClient({
                    username: environment.username,
                    password: environment.password,
                });
            }
        }
    });
    build.task('deleteAppPkg', {
        execute: (config) => {
            return new Promise((resolve, reject) => {
                const catalogWeb = new Web(`https://${environment.tenant}.sharepoint.com/${environment.catalogSite}`);
                let filename = packageSolution.paths.zippedPackage;
                filename = filename.split('/').pop();
                catalogWeb.getFileByServerRelativeUrl(`/${environment.catalogSite}/AppCatalog/${filename}`).delete()
                    .then(resolve)
                    .catch(resolve);
            });
        }
    });
    build.task('uploadAppPkg', {
        execute: (config) => {
            return new Promise((resolve, reject) => {
                const folderLocation = `./sharepoint/${packageSolution.paths.zippedPackage}`;
                const libraryPath = 'AppCatalog';
                const site = `https://${environment.tenant}.sharepoint.com/${environment.catalogSite}`;
                return gulp.src(folderLocation)
                    .pipe(spsync({
                        username: environment.username,
                        password: environment.password,
                        site: site,
                        libraryPath: libraryPath,
                        publish: true
                    }))
                    .on('error', err => {
                        console.log(err.message);
                        reject(err);
                    })
                    .on('finish', resolve);
            });
        }
    });
    build.task('deploySppkg', {
        execute: (config) => {
            if (packageSolution) {
                let filename = packageSolution.paths.zippedPackage;
                filename = filename.split('/').pop();
                const skipFeatureDeployment = packageSolution.solution.skipFeatureDeployment ? packageSolution.solution.skipFeatureDeployment : false;
                return sppkgDeploy.deploy({
                    username: environment.username,
                    password: environment.password,
                    tenant: environment.tenant,
                    site: environment.catalogSite,
                    filename: filename,
                    skipFeatureDeployment: skipFeatureDeployment,
                    verbose: true
                });
            }
        }
    });
}

exports.default = initSpfxPkgDeploy;