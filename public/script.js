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

// Track active filter (all / active / completed)
let currentFilter = "all";

// API functions

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
    throw new Error(data.error || "Failed to Create task");
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
    throw new Error(data.error || "Failed to Update task");
  }
  return res.json();
}

async function deleteTask(id) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to Delete task");
  }
}

// Toast notification system

const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = `toast-msg ${type}`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = "toast-msg hidden";
  }, 3000);
}

// Render tasks in the DOM

function renderTasks(tasks) {
  taskList.innerHTML = "";

  // apply the active filter before rendering
  const filtered = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  if (filtered.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center gap-2";
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" class="form-check-input" ${task.completed ? "checked" : ""} />
      <span class="task-title flex-grow-1 ${task.completed ? "completed" : ""}">${escapeHtml(task.title)}</span>
      <button class="btn btn-sm btn-outline-secondary edit-btn">Edit</button>
      <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
    `;

    li.querySelector("input[type='checkbox']").addEventListener("change", async (e) => {
      try {
        await updateTask(task.id, { completed: e.target.checked });
        await loadTasks();
      } catch (err) {
        showToast(err.message, "error");
      }
    });

    li.querySelector(".edit-btn").addEventListener("click", () => {
      openEditModal(task.id, task.title);
    });

    li.querySelector(".delete-btn").addEventListener("click", async () => {
      if (!confirm("Delete this task?")) return;
      try {
        await deleteTask(task.id);
        showToast("Task deleted.");
        await loadTasks();
      } catch (err) {
        showToast(err.message, "error");
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

// Load and render tasks on page load

async function loadTasks() {
  try {
    const tasks = await fetchTasks();
    renderTasks(tasks);
  } catch (err) {
    console.error(err);
    taskList.innerHTML = "<li>Error loading tasks.</li>";
  }
}

// filter button clicks

document.getElementById("filter-buttons").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;

  currentFilter = btn.dataset.filter;

  // update active button style
  document.querySelectorAll("#filter-buttons button").forEach((b) => {
    b.className = "btn btn-sm btn-outline-dark";
  });
  btn.className = "btn btn-sm btn-dark active";

  loadTasks();
});

// add task form

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
    showToast("Task added successfully!");
    await loadTasks();
  } catch (err) {
    formError.textContent = err.message;
  }
});

// edit modal functions

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
    showToast("Task updated.");
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

// Init

loadTasks();