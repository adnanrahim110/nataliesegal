const { createServer } = require("http");
const next = require("next");

const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const port = process.env.PORT || 3000;
  const host = "127.0.0.1";
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, host, () => {
    console.log(`Next.js is running on http://${host}:${port}`);
  });
});
