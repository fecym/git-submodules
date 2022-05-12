const webpackContext = require.context("../modules/", true, /\w+(Router\.js)$/);
const requireAll = ctx => ctx.keys().map(ctx);
const moduleRoutes = requireAll(webpackContext).map(r => r.default);
const routes = [];
moduleRoutes.forEach(moduleRoute => {
  // 考虑路由定义为对象的情况
  const moduleRoutes = Array.isArray(moduleRoute) ? moduleRoute : [moduleRoute];
  routes.push(...moduleRoutes);
});

export default routes;
