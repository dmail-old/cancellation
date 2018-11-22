"use strict";

var _index = require("../index.js");

var _fixtures = require("./fixtures.js");

var _assert = _interopRequireDefault(require("assert"));

var _cancellation = require("../src/cancellation.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const test = async () => {
  {
    const {
      token: cancellationToken,
      cancel
    } = (0, _index.createCancellationSource)();

    try {
      cancel("cancel").then(values => {
        _assert.default.deepEqual(values, []);

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

      _assert.default.deepEqual(response.statusCode, 200);
    } catch (error) {
      _assert.default.equal((0, _cancellation.isCancelError)(error), true);
    }
  }
};

test();
//# sourceMappingURL=cancel-0.js.map