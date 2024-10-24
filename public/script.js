// === Dans votre index.html ===
const notesList = document.querySelector("#notes-list");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const noteData = Object.fromEntries(formData);
  addNote(noteData);
});
// Fonction pour charger toutes les notes
async function loadNotes() {
  const response = await fetch("/api/notes");
  const notes = await response.json();

  // Afficher les notes dans le HTML
  if (notes.success) {
    notesList.innerHTML = "";
    notes.data.map((note) => displayNote(note)).join(""); // Ici on pourrais utiliser un cutom element HTML et passer les contenue en props
  }
}

// Fonction pour ajouter une note
async function addNote(noteData) {
  titleInput.value = "";
  contentInput.value = "";
  const response = await fetch("/api/notes/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });
  const note = await response.json();
  if (note.success) {
    displayNote(note.data);
  } else {
    alert("Erreur lors de la création de la note");
  }
}

// Fonction pour supprimer une note
async function deleteNote(id) {
  const validate = confirm("Êtes-vous sûr de supprimer cette note");
  if (validate) {
    // TODO //
    const response = await fetch("/api/notes/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const note = await response.json();

    if (!note.success) {
      alert("Erreur lors de la suppression de la note");
    }
    // Recharger les notes
    loadNotes();
  }
}

let editId = undefined;
async function editNote(id) {
  const title = document.getElementById(`title${id}`);
  title.classList.add("hide");
  const inputTitle = document.getElementById(`inputTitle${id}`);
  inputTitle.classList.remove("hide");
  const content = document.getElementById(`content${id}`);
  content.classList.add("hide");
  const inputContent = document.getElementById(`inputContent${id}`);
  inputContent.classList.remove("hide");
  const button = document.getElementById(`editBtn${id}`);
  button.value = "Valider";
  if (editId !== id && editId !== undefined) {
    document.getElementById(`title${editId}`).classList.remove("hide");
    document.getElementById(`inputTitle${editId}`).classList.add("hide");
    document.getElementById(`content${editId}`).classList.remove("hide");
    document.getElementById(`inputContent${editId}`).classList.add("hide");
    document.getElementById(`editBtn${editId}`).value = "Modifier";
    editId = id;
  } else if (editId === id && editId !== undefined) {
    const response = await fetch("/api/notes/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        title: inputTitle.value,
        content: inputContent.value,
      }),
    });
    const note = await response.json();
    if (note.success) {
      title.innerText = `${note.data.title}`;
      content.innerText = `${note.data.content}`;
    } else {
      alert("Erreur lors de la modification de la note");
    }
    title.classList.remove("hide");
    content.classList.remove("hide");
    inputTitle.classList.add("hide");
    inputContent.classList.add("hide");
    button.value = "Modifier";
    editId = undefined;
  } else if (editId === undefined) {
    editId = id;
  }
}

function displayNote(note) {
  const card = {
    type: "div",
    attributes: {
      class: "note",
    },
    childs: [
      {
        type: "div",
        childs: [
          {
            type: "h3",
            attributes: {
              id: `title${note.id}`,
            },
            childs: [
              {
                type: "text",
                text: `${note.title}`,
              },
            ],
          },
          {
            type: "input",
            attributes: {
              id: `inputTitle${note.id}`,
              name: `title`,
              type: "text",
              value: `${note.title}`,
              class: "hide",
            },
          },
        ],
      },
      {
        type: "div",
        childs: [
          {
            type: "p",
            attributes: {
              id: `content${note.id}`,
            },
            childs: [
              {
                type: "text",
                text: `${note.content}`,
              },
            ],
          },
          {
            type: "textarea",
            attributes: {
              id: `inputContent${note.id}`,
              name: `content`,
              class: "hide",
            },
            childs: [
              {
                type: "text",
                text: `${note.content}`,
              },
            ],
          },
        ],
      },
      {
        type: "input",
        attributes: {
          id: `editBtn${note.id}`,
          type: "submit",
          value: "Modifier",
        },
        listners: {
          click: (e) => {
            e.preventDefault();
            editNote(note.id);
          },
        },
      },
      {
        type: "input",
        attributes: {
          type: "submit",
          value: "X",
          class: "btnDelete",
        },
        listners: {
          click: (e) => {
            e.preventDefault();
            deleteNote(note.id);
          },
        },
      },
    ],
  };
  addChildElement(notesList, card);
}

function addChildElement(parent, data) {
  let el = null;
  if (data.type !== "text") {
    el = document.createElement(data.type);
    if (data.classes) {
      for (let className of data.classes) {
        el.classList.add(className);
      }
    }
    if (data.attributes) {
      for (let attribute in data.attributes) {
        el.setAttribute(attribute, data.attributes[attribute]);
      }
    }
    if (data.childs) {
      for (let child of data.childs) {
        addChildElement(el, child);
      }
    }
    if (data.listners) {
      for (let listner in data.listners) {
        el.addEventListener(listner, data.listners[listner]);
      }
    }
  } else {
    el = document.createTextNode(data.text);
  }
  parent.append(el);
}

loadNotes();
