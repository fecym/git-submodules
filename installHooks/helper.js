const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function findHooksDir(dir) {
  if (dir) {
    let gitDir = path.join(dir, ".git");
    if (!fs.existsSync(gitDir)) return;

    const stats = fs.lstatSync(gitDir);

    if (stats.isFile()) {
      const gitFileData = fs.readFileSync(gitDir, "utf-8");
      gitDir = gitFileData.split(":").slice(1).join(":").trim();
    }

    return path.resolve(dir, gitDir, "hooks");
  }
}

const hooks = [
  "applypatch-msg",
  "pre-applypatch",
  "post-applypatch",
  "pre-commit",
  "prepare-commit-msg",
  "commit-msg",
  "post-commit",
  "pre-rebase",
  "post-checkout",
  "post-merge",
  "pre-push",
  "pre-receive",
  "update",
  "post-receive",
  "post-update",
  "push-to-checkout",
  "pre-auto-gc",
  "post-rewrite",
  "sendemail-validate",
];

function getSubmoduleDirs() {
  const parentDir = path.resolve(__dirname, "../src/modules");
  const dirs = ["submodules-1", "submodules-2"];
  return dirs.map(dir => path.resolve(parentDir, dir));
}
const submoduleDirs = getSubmoduleDirs();
const log = console.log;
const warnLogger = text => log(chalk.bgYellow.black(" WARN "), chalk.yellow(text));
const doneLogger = text => log(chalk.bgGreen.black(" DONE "), chalk.green(text));
const infoLogger = text => log(chalk.bgBlue.black(" INFO "), chalk.magenta(text));

module.exports = {
  findHooksDir,
  submoduleDirs,
  hooks,
  warnLogger,
  doneLogger,
  infoLogger,
};
