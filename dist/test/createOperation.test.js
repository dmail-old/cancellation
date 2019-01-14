"use strict";

var _index = require("../index.js");

var _expectProcessUnhandledRejections = require("./expectProcessUnhandledRejections.js");

const error = new Error("here");
(0, _expectProcessUnhandledRejections.expectProcessUnhandledRejections)({
  expected: [error]
});
(0, _index.createOperation)({
  start: () => {
    throw error;
  }
});
//# sourceMappingURL=./createOperation.test.js.map