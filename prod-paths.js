
/*
    From https://github.com/Kehrlann/module-alias-74
    By @Kehrlann at GitHub
*/

const tsConfig = require("./tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");

const baseUrl = "./target";
const cleanup = tsConfigPaths.register({
    baseUrl,
    paths: tsConfig.compilerOptions.paths
});