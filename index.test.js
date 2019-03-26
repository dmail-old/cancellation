import "./test/cancel-0.js"
import "./test/cancel-1.js"
import "./test/cancel-2.js"
import "./test/cancel-3-delayed.js"
import "./test/cancel-3.js"
import "./test/cancel-4.js"
import "./test/cancellationRequested.test.js"

// we cannot enable the two tests below because
// every test does not have its own process, only one of
// createOperation.test.js, createAbortableOperation.test.js, createStoppableOperation.test.js
// can be enabled for now

import "./test/concurrent/concurrent-basic.test.js"
// import "./test/createOperation.test.js"
// import "./test/createAbortableOperation.test.js"
// import "./test/createStoppableOperation.test.js"
