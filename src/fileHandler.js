const fs = require("fs/promises");
const db = require("./database.js");

function getNotes() {
  const notes = db.getAll();
  const response = {
    success: true,
    data: notes,
  };
  return JSON.stringify(response);
}

function addNote(data) {
  data = JSON.parse(data);
  const info = db.insert(data.title, data.content);
  let response = undefined;
  if (info.changes > 0) {
    response = {
      success: true,
      data: {
        id: info.lastInsertRowid,
        title: data.title,
        content: data.content,
      },
    };
  } else {
    response = {
      success: false,
    };
  }
  return JSON.stringify(response);
}

function deleteNote(data) {
  data = JSON.parse(data);
  const info = db.deleteNote(data.id);
  let response = undefined;
  if (info.changes > 0) {
    response = {
      success: true,
    };
  } else {
    response = {
      success: false,
    };
  }
  return JSON.stringify(response);
}

function updateNote(data) {
  data = JSON.parse(data);
  const info = db.updateNote(data.id, data.title, data.content);
  let response = undefined;
  if (info.changes > 0) {
    response = {
      success: true,
      data: {
        title: data.title,
        content: data.content,
      },
    };
  } else {
    response = {
      success: false,
    };
  }
  return JSON.stringify(response);
}

function writeLog(message) {
  let date = new Date();
  fs.appendFile(
    "access.log",
    `[${date.toLocaleDateString()}| ${date.toTimeString()}] ${message}\n`,
    (err) => {
      if (err) throw err;
      console.log("Saved!");
    }
  );
}

module.exports = { getNotes, addNote, deleteNote, updateNote, writeLog };
