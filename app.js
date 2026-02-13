let myNotes = [];
let currentEditId = null;

function loadMyNotes() {
  const stored = localStorage.getItem('myNotePad');
  return stored ? JSON.parse(stored) : [];
}

function handleSaveNote(e) {
  e.preventDefault();

  const title = document.getElementById('titleInput').value.trim();
  const content = document.getElementById('contentInput').value.trim();

  if (currentEditId) {
    const index = myNotes.findIndex(note => note.id === currentEditId);
    myNotes[index] = { ...myNotes[index], title, content };
  } else {
    myNotes.unshift({ id: Date.now().toString(), title, content });
  }

  closeNoteModal();
  persistNotes();
  displayNotes();
}

function persistNotes() {
  localStorage.setItem('myNotePad', JSON.stringify(myNotes));
}

function removeNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  myNotes = myNotes.filter(note => note.id !== id);
  persistNotes();
  displayNotes();
}

function displayNotes() {
  const board = document.getElementById('noteBoard');

  if (!myNotes.length) {
  board.innerHTML = `
    <div class="empty-state">
      <h2>No notes yet</h2>
      <p>Start writing your first note!</p>
      <button class="new-note-btn" id="addFirstNoteBtn">+ Add Note</button>
    </div>
  `;

  const addBtn = document.getElementById('addFirstNoteBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => openNoteModal());
  }
  return;
}


  board.innerHTML = myNotes.map(note => `
    <div class="note-card">
      <h3 class="note-title">${note.title}</h3>
      <p class="note-content">${note.content}</p>
      <div class="note-actions">
        <button class="edit-btn" onclick="openNoteModal('${note.id}')" title="Edit">
          ✏️
        </button>
        <button class="delete-btn" onclick="removeNote('${note.id}')" title="Delete">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function openNoteModal(id = null) {
  const modal = document.getElementById('noteModal');
  const titleInput = document.getElementById('titleInput');
  const contentInput = document.getElementById('contentInput');

  if (id) {
    const note = myNotes.find(n => n.id === id);
    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Note';
    titleInput.value = note.title;
    contentInput.value = note.content;
  } else {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'New Note';
    titleInput.value = '';
    contentInput.value = '';
  }

  modal.showModal();
  titleInput.focus();
}

function closeNoteModal() {
  document.getElementById('noteModal').close();
}

function toggleAppTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('appTheme', isDark ? 'dark' : 'light');
  document.getElementById('modeSwitchBtn').textContent = isDark ? '☀️' : '🌙';
}

function applyTheme() {
  if (localStorage.getItem('appTheme') === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('modeSwitchBtn').textContent = '☀️';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  myNotes = loadMyNotes();
  displayNotes();

  document.getElementById('noteEntryForm').addEventListener('submit', handleSaveNote);
  document.getElementById('modeSwitchBtn').addEventListener('click', toggleAppTheme);

  document.getElementById('noteModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeNoteModal();
  });
});
