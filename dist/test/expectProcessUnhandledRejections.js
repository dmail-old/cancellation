"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectProcessUnhandledRejections = void 0;

var _assert = require("@dmail/assert");

var _helper = require("@dmail/helper");

const expectProcessUnhandledRejections = ({
  message,
  expected
}) => {
  let unhandledRejections = [];
  process.on("unhandledRejection", (error, promise) => {
    unhandledRejections = [...unhandledRejections, {
      error,
      promise
    }];
  });
  process.on("rejectionHandled", promise => {
    unhandledRejections = (0, _helper.arrayWithout)(unhandledRejections, unhandledRejection => unhandledRejection.promise === promise);
  });
  process.on("exit", () => {
    if (process.exitCode === 0 || process.exitCode === undefined) {
      const actual = unhandledRejections.map(({
        error
      }) => error);
      (0, _assert.assert)({
        message,
        actual,
        expected
      });
    }
  });
};

exports.expectProcessUnhandledRejections = expectProcessUnhandledRejections;
//# sourceMappingURL=./expectProcessUnhandledRejections.js.map