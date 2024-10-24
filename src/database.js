const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "../database/notes.db")); // create a new database
function createBD() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`); // writing to notes.db
  return db;
}
module.exports = { createBD };
