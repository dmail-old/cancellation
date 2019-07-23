const { startContinuousTesting } = require("@jsenv/testing")
const { projectPath, testDescription } = require("../../jsenv.config.js")

startContinuousTesting({
  projectPath,
  executeDescription: testDescription,
})
