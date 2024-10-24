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

function getAll() {
  const notes = db.prepare("SELECT * FROM notes");
  const info = notes.all();
  return info;
}

function insert(title, content) {
  const insert = db.prepare("INSERT INTO notes (title, content) VALUES (?, ?)");
  const info = insert.run(title, content);
  return info;
}

function deleteNote(id) {
  const deleteNote = db.prepare("DELETE FROM notes WHERE id = ?");
  const info = deleteNote.run(id);
  return info;
}

function updateNote(id, title, content) {
  const update = db.prepare(
    "UPDATE notes SET title = ?, content = ? WHERE id = ?"
  );
  const info = update.run(title, content, id);
  return info;
}

module.exports = { createBD, getAll, insert, deleteNote, updateNote };
