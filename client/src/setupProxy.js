const { createProxyMiddleware } = require('http-proxy-middleware');

const getProxyTarget = () => {
  if (process.env.REACT_APP_PROXY_TARGET) {
    return process.env.REACT_APP_PROXY_TARGET;
  }

  const host = process.env.DEV_BACKEND_HOST || 'localhost';
  const port = process.env.DEV_BACKEND_PORT || '5000';
  return `http://${host}:${port}`;
};

module.exports = function setupProxy(app) {
  const target = getProxyTarget();

  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      logLevel: 'warn'
    })
  );
};

