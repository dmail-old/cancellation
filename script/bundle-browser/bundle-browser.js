const { bundleBrowser } = require("@jsenv/core")
const { importMap, projectFolder, babelPluginDescription } = require("../../jsenv.config.js")

bundleBrowser({
  importMap,
  projectFolder,
  into: "dist/browser",
  babelPluginDescription,
  entryPointsDescription: {
    main: "index.js",
  },
  globalName: "__dmail_cancellation__",
  verbose: true,
})
