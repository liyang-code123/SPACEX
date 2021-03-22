const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://api.n2yo.com',
            changeOrigin: true,
        })
    );
};
// createProxyMiddleware and setupProxy 创建中转服务器，实现跨域访问。
// createReactAPP: fetching date by Ajax.