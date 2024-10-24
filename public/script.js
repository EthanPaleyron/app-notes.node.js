// === Dans votre index.html ===
// Fonction pour charger toutes les notes
async function loadNotes() {
  const response = await fetch("/api/notes");
  const notes = await response.json();

  // Afficher les notes dans le HTML
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = notes
    .map(
      (note) => `
        <div class="note">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="deleteNote(${note.id})">Supprimer</button>
        </div>
    `
    )
    .join(""); // Ici on pourrais utiliser un cutom element HTML et passer les contenue en props
}

// Fonction pour ajouter une note
async function addNote(event) {
  // TODO //
  // Recharger les notes
  loadNotes();
}

// Fonction pour supprimer une note
async function deleteNote(id) {
  // TODO //
  // Recharger les notes
  loadNotes();
}
