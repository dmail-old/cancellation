const { launchNode, launchChromium } = require("@jsenv/core")

const both = {
  browser: {
    launch: launchChromium,
  },
  node: {
    launch: launchNode,
  },
}
const browserOnly = {
  browser: {
    launch: launchChromium,
  },
  node: null,
}
const nodeOnly = {
  // seems like it does not work, check
  // project-structure to see if there is a bug in it
  browser: null,
  node: {
    launch: launchNode,
  },
}

const testDescription = {
  "/test/**/*.test.js": both,
  "/test/**/browser/*.test.js": browserOnly,
  "/test/**/*.browser.test.js": browserOnly,
  "/test/**/node/*.test.js": nodeOnly,
  "/test/**/*.node.test.js": nodeOnly,
}
exports.testDescription = testDescription
