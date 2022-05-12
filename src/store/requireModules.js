const modulesFiles = require.context("../modules", true, /\w+(Store\.js)$/);
const replacer = (m, p) => p.slice(0, -5);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/.+\/(\w+Store)\.js/, replacer);
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

export default modules;
