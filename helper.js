// import {
//   Worker,
//   isMainThread,
//   parentPort,
//   workerData,
// } from "node:worker_threads";

// if (isMainThread) {
//   function parseJSAsync(script) {
//     return new Promise((resolve, reject) => {
//       const worker = new Worker(__filename, {
//         workerData: script,
//       });
//       worker.on("message", resolve);
//       worker.on("error", reject);
//       worker.on("exit", (code) => {
//         if (code !== 0)
//           reject(new Error(`Worker stopped with exit code ${code}`));
//       });
//     });
//   }
// } else {
//   const { parse } = require("some-js-parsing-library");
//   const script = workerData;
//   parentPort.postMessage(parse(script));
// }

export function parseOperations(operations) {
  let p = 0;
  const result = [];
  for (let i = 0; i < operations.length; i++) {
    if (operations[i] == "~") {
      p = 0;
      continue;
    }
    if (p == 0) {
      result.push({ name: operations[i], args: [] });
      p = 1;
    } else if (p == 1) {
      let op = operations[i];
      if (!Number.isNaN(+op)) op = +op;
      else if (op == "true") op = true;
      else if (op == "false") op = false;
      else if (op.indexOf("x") !== -1) op = op.split("x").map((v) => +v);

      if (Array.isArray(op)) result[result.length - 1].args.push(...op);
      else result[result.length - 1].args.push(op);
    }
  }

  return result;
}
