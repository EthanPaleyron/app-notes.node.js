const fs = require("fs");
const path = require("path");
const fh = require("./fileHandler.js");

const PUBLIC_DIR = path.join(__dirname, "../public");

// Liste restreinte de types MIME autorisés
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".scss": "text/scss",
  ".js": "text/javascript",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

function route(req, res) {
  fh.writeLog(`${req.method}: ${req.url}`);
  if (req.url.startsWith("/api")) {
    const routes = {
      "GET|/api/notes": fh.getNotes,
      "POST|/api/notes/add": fh.addNote,
      "POST|/api/notes/update": fh.updateNote,
      "DELETE|/api/notes/delete": fh.deleteNote,
    };
    const route = `${req.method}|${req.url}`;
    if (routes[route]) {
      try {
        const response = routes[route](req.body);
        res.end(response, "utf-8");
      } catch (error) {
        fh.writeLog(`Erreur: ${error}`);
        res.end(JSON.stringify({ success: false }), "utf-8");
      }
    } else {
      fh.writeLog("Erreur 404");
    }
  } else {
    // Construire le chemin du fichier
    let filePath = path.join(
      PUBLIC_DIR,
      req.url === "/" ? "index.html" : req.url
    );

    // Obtenir l'extension du fichier
    let extname = path.extname(filePath);

    // Vérifier si le type MIME est autorisé
    let contentType = MIME_TYPES[extname];

    if (!contentType) {
      // Si le type MIME n'est pas autorisé, renvoyer une erreur 415
      res.writeHead(415, { "Content-Type": "text/plain" });
      fh.writeLog(`Erreur 415: Unsupported Media Type`);
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
            fh.writeLog(`Erreur 404`);
          });
        } else {
          // Erreur serveur
          res.writeHead(500);
          res.end(`Erreur serveur: ${err.code}`);
          fh.writeLog(`Erreur serveur: ${err.code}`);
        }
      } else {
        // Succès
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  }
}

module.exports = { route };
