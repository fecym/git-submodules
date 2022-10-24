require("./checkHooks")().then(checked => {
  if (!checked) require("./install.hooks");
});
