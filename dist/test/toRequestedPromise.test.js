"use strict";

var _assert = _interopRequireDefault(require("assert"));

var _index = require("../index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

{
  const test = async () => {
    const {
      token,
      cancel
    } = (0, _index.createCancellationSource)();
    cancel("cancel");
    const reason = await token.toRequestedPromise();

    _assert.default.equal(reason, "cancel");
  };

  test();
}
{
  const test = async () => {
    const {
      token,
      cancel
    } = (0, _index.createCancellationSource)();
    setTimeout(() => cancel("cancel"), 10);
    const reason = await token.toRequestedPromise();

    _assert.default.equal(reason, "cancel");
  };

  test();
}
//# sourceMappingURL=toRequestedPromise.test.js.map