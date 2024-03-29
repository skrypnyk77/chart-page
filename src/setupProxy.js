const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://monitoring.s4ga.tech/sf",
      changeOrigin: true,
    })
  );

  app.use(
    "/stats",
    createProxyMiddleware({
      target: "http://monitoring.s4ga.tech",
      changeOrigin: true,
    })
  );
};
