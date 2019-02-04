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
      }); // setTimeout allow to trigger socket hangup error

      setTimeout(() => {
        cancel("cancel");
      }, 2);
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
//# sourceMappingURL=./cancel-3-delayed.js.map