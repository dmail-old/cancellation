"use strict";

var _assert = require("@dmail/assert");

var _index = require("../index.js");

var _fixtures = require("./fixtures.js");

const test = async () => {
  {
    const {
      token: cancellationToken,
      cancel
    } = (0, _index.createCancellationSource)();

    try {
      cancel("cancel").then(values => {
        (0, _assert.assert)({
          actual: values,
          expected: []
        });
        console.log("passed");
      });
      const portPromise = (0, _fixtures.startServer)({
        cancellationToken
      });
      const port = await portPromise;
      const responsePromise = (0, _fixtures.requestServer)({
        cancellationToken,
        port
      });
      const response = await responsePromise;
      (0, _assert.assert)({
        actual: response.statusCode,
        expected: 200
      });
    } catch (error) {
      (0, _assert.assert)({
        actual: (0, _index.isCancelError)(error),
        expected: true
      });
    }
  }
};

test();
//# sourceMappingURL=./cancel-0.js.map