const https = require("https");
const http = require("http");
const { createProxyServer } = require("http-proxy");
const fs = require("fs");

// Load SSL certificates
const httpsOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/campagain.kwsc.gos.pk/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/campagain.kwsc.gos.pk/fullchain.pem"),
};

// Create a proxy server
const proxy = createProxyServer({
  target: "http://localhost:3000", // Your Next.js app
  changeOrigin: true,
});

// HTTPS server to handle incoming traffic
https.createServer(httpsOptions, (req, res) => {
  proxy.web(req, res);
}).listen(443, () => {
  console.log("HTTPS Proxy running on port 443");
});

// Optional: Redirect HTTP to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log("Redirecting HTTP to HTTPS");
});
