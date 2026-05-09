const API = "/api/tasks";

// DOM references
const addForm = document.getElementById("add-form");
const taskTitleInput = document.getElementById("task-title");
const formError = document.getElementById("form-error");
const taskList = document.getElementById("task-list");
const emptyMsg = document.getElementById("empty-msg");

const modalOverlay = document.getElementById("modal-overlay");
const editTitleInput = document.getElementById("edit-title");
const editError = document.getElementById("edit-error");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

// Track which task is being edited
let editingTaskId = null;

// ── API helpers ──────────────────────────────────────────────────────────────

async function fetchTasks() {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

async function createTask(title) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create task");
  }
  return res.json();
}

async function updateTask(id, updates) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update task");
  }
  return res.json();
}

async function deleteTask(id) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete task");
  }
}

// ── Render ───────────────────────────────────────────────────────────────────

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} title="Mark complete" />
      <span class="task-title ${task.completed ? "completed" : ""}">${escapeHtml(task.title)}</span>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="danger delete-btn">Delete</button>
      </div>
    `;

    // Checkbox toggle
    li.querySelector("input[type='checkbox']").addEventListener("change", async (e) => {
      try {
        await updateTask(task.id, { completed: e.target.checked });
        await loadTasks();
      } catch (err) {
        alert(err.message);
      }
    });

    // Edit button
    li.querySelector(".edit-btn").addEventListener("click", () => {
      openEditModal(task.id, task.title);
    });

    // Delete button
    li.querySelector(".delete-btn").addEventListener("click", async () => {
      if (!confirm("Delete this task?")) return;
      try {
        await deleteTask(task.id);
        await loadTasks();
      } catch (err) {
        alert(err.message);
      }
    });

    taskList.appendChild(li);
  });
}

// Prevent XSS when inserting user-supplied text into the DOM
function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ── Load ─────────────────────────────────────────────────────────────────────

async function loadTasks() {
  try {
    const tasks = await fetchTasks();
    renderTasks(tasks);
  } catch (err) {
    console.error(err);
    taskList.innerHTML = "<li>Error loading tasks.</li>";
  }
}

// ── Add form ─────────────────────────────────────────────────────────────────

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.textContent = "";

  const title = taskTitleInput.value.trim();

  // Client-side validation
  if (!title) {
    formError.textContent = "Task title cannot be empty.";
    return;
  }

  try {
    await createTask(title);
    taskTitleInput.value = "";
    await loadTasks();
  } catch (err) {
    formError.textContent = err.message;
  }
});

// ── Edit modal ───────────────────────────────────────────────────────────────

function openEditModal(id, currentTitle) {
  editingTaskId = id;
  editTitleInput.value = currentTitle;
  editError.textContent = "";
  modalOverlay.classList.remove("hidden");
  editTitleInput.focus();
}

function closeEditModal() {
  editingTaskId = null;
  modalOverlay.classList.add("hidden");
}

saveBtn.addEventListener("click", async () => {
  editError.textContent = "";
  const newTitle = editTitleInput.value.trim();

  // Client-side validation
  if (!newTitle) {
    editError.textContent = "Title cannot be empty.";
    return;
  }

  try {
    await updateTask(editingTaskId, { title: newTitle });
    closeEditModal();
    await loadTasks();
  } catch (err) {
    editError.textContent = err.message;
  }
});

cancelBtn.addEventListener("click", closeEditModal);

// Close modal if clicking outside
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeEditModal();
});

// ── Init ─────────────────────────────────────────────────────────────────────

loadTasks();
