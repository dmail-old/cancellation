"use strict";

var _index = require("../index.js");

var _expectProcessUnhandledRejections = require("./expectProcessUnhandledRejections.js");

const error = new Error("here");
(0, _expectProcessUnhandledRejections.expectProcessUnhandledRejections)({
  message: "one unhandled rejection",
  expected: [error]
});
(0, _index.createStoppableOperation)({
  stop: () => {},
  start: () => {
    throw error;
  }
});
//# sourceMappingURL=./createStoppableOperation.test.js.map