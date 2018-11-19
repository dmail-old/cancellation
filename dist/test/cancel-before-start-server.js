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
    cancel("cancel").then(values => {
      _assert.default.deepEqual(values, []);
    });
    const serverPromise = (0, _fixtures.startServer)({
      cancellationToken
    });
    await serverPromise;
    const responsePromise = (0, _fixtures.requestServer)({
      cancellationToken
    });
    return responsePromise;
  };

  exec().then(() => {
    _assert.default.fail("must not be called");

    console.log("passed");
  });
}
//# sourceMappingURL=cancel-before-start-server.js.map