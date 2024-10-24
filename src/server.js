const { createBD } = require("./database");
const http = require("http");
const fs = require("fs");
const path = require("path");

createBD();

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "../public");

// Liste restreinte de types MIME autorisés
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  // Construire le chemin du fichier
  let filePath = path.join(
    PUBLIC_DIR,
    req.url === "/" ? "/index.html" : req.url
  );

  // Obtenir l'extension du fichier
  let extname = path.extname(filePath);
  // Vérifier si le type MIME est autorisé
  let contentType = MIME_TYPES[extname];

  if (!contentType) {
    // Si le type MIME n'est pas autorisé, renvoyer une erreur 415
    res.writeHead(415, { "Content-Type": "text/plain" });
    return res.end("415 - Unsupported Media Type");
  }

  // Lire le fichier
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        //“Error NO ENTry”
        // Fichier non trouvé
        fs.readFile(path.join(PUBLIC_DIR, "404.html"), (err, content) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(content, "utf-8");
        });
      } else {
        // Erreur serveur
        res.writeHead(500);
        res.end(`Erreur serveur: ${err.code}`);
      }
    } else {
      // Succès
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}/`);
});
