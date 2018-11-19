"use strict";

var _index = require("../index.js");

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

{
  const test = async () => {
    const {
      token,
      cancel
    } = (0, _index.createCancellationSource)();
    cancel("cancel");
    (0, _index.cancellationTokenToPromise)(token).then(() => {
      _assert.default.fail("must not be called");
    });
  };

  test();
}
console.log("passed");
//# sourceMappingURL=cancellationTokenToPromise.test.js.map