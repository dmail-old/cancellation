"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memoizeOnce = void 0;

const memoizeOnce = compute => {
  let locked = false;
  let lockValue;

  const memoized = (...args) => {
    if (locked) return lockValue; // if compute is recursive wait for it to be fully done before storing the lockValue
    // so set locked later

    lockValue = compute(...args);
    locked = true;
    return lockValue;
  };

  memoized.deleteCache = () => {
    const value = lockValue;
    locked = false;
    lockValue = undefined;
    return value;
  };

  return memoized;
};

exports.memoizeOnce = memoizeOnce;
//# sourceMappingURL=./memoizeOnce.js.map