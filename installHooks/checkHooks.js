const path = require("path");
const { findHooksDir, hooks, submoduleDirs, warnLogger } = require("./helper");
const fs = require("fs");
const { promisify } = require("util");
const exists = promisify(fs.exists);
const defaultDir = path.resolve(__dirname, "..");

function checkHooks(huskyDir = defaultDir) {
  return new Promise((resolve, rejected) => {
    const hooksDir = findHooksDir(huskyDir, ".git");
    Promise.all(hooks.map(hook => exists(hooksDir && path.resolve(hooksDir, hook)))).then(res => {
      const relativeDir = path.relative(__dirname, huskyDir);
      resolve({
        hooksDir,
        huskyDir,
        relativeDir,
        result: res.every(x => !!x),
      });
    }, rejected);
  });
}

module.exports = function check() {
  return new Promise((resolve, rejected) => {
    setTimeout(() => {
      Promise.all(submoduleDirs.map(checkHooks)).then(result => {
        const res = result.filter(r => !r.result);
        const logger = r => {
          const text = `${r.relativeDir.replace("../src/modules/", "")} 子模块未注册 Git Hook`;
          warnLogger(text);
        };
        res.forEach(logger);
        resolve(!res.length);
      }, rejected);
    }, 2000);
  });
};
