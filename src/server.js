const { createBD } = require("./database");
const http = require("http");
const fh = require("./fileHandler.js");
const router = require("./router.js");

const PORT = 3000;

const server = http.createServer((req, res) => {
  createBD();
  req
    .on("data", (chunk) => {
      if (!req.body) req.body = [];

      req.body.push(chunk);
    })
    .on("end", () => {
      if (req.body) {
        req.body = Buffer.concat(req.body)
          .toString()
          .split("&")
          .reduce((acc, pair) => {
            const [key, value] = pair.split("=");

            acc[key] = value;

            return acc;
          });
      }
      router.route(req, res);
    });
});

server.listen(PORT, () => {
  fh.writeLog(`Serveur en cours d'exécution sur http://localhost:${PORT}/`);
});
