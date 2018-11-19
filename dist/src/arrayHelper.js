"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayWithout = void 0;

// TODO: externalize this into '@dmail/helper'
// import { arrayWithout } from '@dmail/helper'
const arrayWithout = (array, item) => {
  const arrayWithoutItem = [];
  let i = 0;

  while (i < array.length) {
    const value = array[i];
    i++;

    if (value === item) {
      continue;
    }

    arrayWithoutItem.push(value);
  }

  return arrayWithoutItem;
};

exports.arrayWithout = arrayWithout;
//# sourceMappingURL=arrayHelper.js.map