"use strict";

var _index = require("../index.js");

var _fixtures = require("./fixtures.js");

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      cancel("cancel").then(values => {
        _assert.default.deepEqual(values, ["server closed because cancel"]);

        console.log("passed");
      });

      _assert.default.deepEqual(response.statusCode, 200);
    } catch (error) {
      _assert.default.fail("must no be called");
    }
  }
};

test();
//# sourceMappingURL=cancel-4.js.map