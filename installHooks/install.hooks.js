const fs = require("fs");
const path = require("path");
const findHooksDir = require("yorkie/src/utils/find-hooks-dir");
const getHookScript = require("yorkie/src/utils/get-hook-script");
const is = require("yorkie/src/utils/is");
const hooks = require("yorkie/src/hooks.json");
const { submoduleDirs, doneLogger, warnLogger, infoLogger } = require("./helper");

const SKIP = "SKIP";
const UPDATE = "UPDATE";
const MIGRATE_GHOOKS = "MIGRATE_GHOOKS";
const MIGRATE_PRE_COMMIT = "MIGRATE_PRE_COMMIT";
const CREATE = "CREATE";

const runnerPath = path.resolve("./node_modules/yorkie/src/runner.js");

function write(filename, data) {
  fs.writeFileSync(filename, data);
  fs.chmodSync(filename, parseInt("0755", 8));
}

function createHook(hooksDir, hookName) {
  const filename = path.join(hooksDir, hookName);

  const hookScript = getHookScript(hookName, ".", runnerPath);

  // Create hooks directory if needed
  if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir);

  if (!fs.existsSync(filename)) {
    write(filename, hookScript);
    return CREATE;
  }

  if (is.ghooks(filename)) {
    write(filename, hookScript);
    return MIGRATE_GHOOKS;
  }

  if (is.preCommit(filename)) {
    write(filename, hookScript);
    return MIGRATE_PRE_COMMIT;
  }

  if (is.huskyOrYorkie(filename)) {
    write(filename, hookScript);
    return UPDATE;
  }

  return SKIP;
}

function installFrom(projectDir) {
  try {
    const hooksDir = findHooksDir(projectDir);
    if (hooksDir) {
      const createAction = name => createHook(hooksDir, name);
      hooks.map(hookName => ({ hookName, action: createAction(hookName) }));
      const submodule = path.relative(__dirname, projectDir);
      const text = `${submodule.replace("../src/modules/", "")} 注册成功`;
      doneLogger(text);
    } else {
      warnLogger(`can't find .git directory, skipping Git hooks installation`);
    }
  } catch (e) {
    console.error(e);
  }
}

infoLogger("开始注册所有子模块的 hooks");

submoduleDirs.forEach(installFrom);
