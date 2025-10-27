const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api' // Keep /api prefix
      }
    })
  );

  // Also proxy Google Maps API calls if needed
  app.use(
    '/maps',
    createProxyMiddleware({
      target: 'https://maps.googleapis.com',
      changeOrigin: true,
      pathRewrite: {
        '^/maps': ''
      }
    })
  );
};
