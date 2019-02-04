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
      const portPromise = (0, _fixtures.startServer)({
        cancellationToken
      });
      const port = await portPromise;
      const responsePromise = (0, _fixtures.requestServer)({
        cancellationToken,
        port
      });
      const response = await responsePromise;
      cancel("cancel");
      (0, _assert.assert)({
        actual: response.statusCode,
        expected: 200
      });
    } catch (error) {
      (0, _assert.assert)({
        message: "must no be called",
        actual: true,
        expected: false
      });
    }
  }
};

test();
//# sourceMappingURL=./cancel-4.js.map