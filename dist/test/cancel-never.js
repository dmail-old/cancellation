"use strict";

var _fixtures = require("./fixtures.js");

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

{
  const exec = async () => {
    const serverPromise = (0, _fixtures.startServer)();
    await serverPromise;
    const responsePromise = (0, _fixtures.requestServer)();
    return responsePromise;
  };

  exec().then(({
    statusCode
  }) => {
    _assert.default.equal(statusCode, 200);

    console.log("passed");
  });
}
//# sourceMappingURL=cancel-never.js.map