"use strict";

var _index = require("../index.js");

var _fixtures = require("./fixtures.js");

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

{
  const {
    token: cancellationToken,
    cancel
  } = (0, _index.createCancellationSource)();

  const exec = async () => {
    const serverPromise = (0, _fixtures.startServer)({
      cancellationToken
    });
    await serverPromise;
    cancel("cancel").then(values => {
      _assert.default.deepEqual(values, ["server closed because cancel"]);

      console.log("passed");
    });
    const responsePromise = (0, _fixtures.requestServer)({
      cancellationToken
    });
    await responsePromise;
  };

  exec().then(() => {
    _assert.default.fail("must not be called");
  });
}
//# sourceMappingURL=cancel-before-request-server.js.map