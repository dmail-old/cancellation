"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createCancellationToken", {
  enumerable: true,
  get: function () {
    return _cancellation.createCancellationToken;
  }
});
Object.defineProperty(exports, "createCancellationSource", {
  enumerable: true,
  get: function () {
    return _cancellation.createCancellationSource;
  }
});
Object.defineProperty(exports, "cancellationTokenCompose", {
  enumerable: true,
  get: function () {
    return _cancellation.cancellationTokenCompose;
  }
});
Object.defineProperty(exports, "toRejectedIfRequested", {
  enumerable: true,
  get: function () {
    return _cancellation.toRejectedIfRequested;
  }
});
Object.defineProperty(exports, "toPendingIfRequested", {
  enumerable: true,
  get: function () {
    return _cancellation.toPendingIfRequested;
  }
});

var _cancellation = require("./src/cancellation.js");
//# sourceMappingURL=index.js.map