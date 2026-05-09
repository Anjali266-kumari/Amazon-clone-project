const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const taskCount = document.getElementById("task-count");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("taskmaster_data")) || [];
let currentFilter = "all";

function renderTasks() {
  listContainer.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("checked");
    }

    li.innerHTML = `
      <div class="task-content" onclick="toggleTask(${task.id})">
        <div class="checkbox">
          <i class="ph-bold ph-check check-icon"></i>
        </div>
        <span class="task-text">${escapeHTML(task.text)}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask(${task.id})" aria-label="Delete task">
        <i class="ph ph-trash"></i>
      </button>
    `;
    listContainer.appendChild(li);
  });

  updateStats();
}

function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[tag] || tag,
  );
}

function addTask() {
  const text = inputBox.value.trim();
  if (text === "") {
    inputBox.parentElement.style.animation = "shake 0.5s";
    setTimeout(() => {
      inputBox.parentElement.style.animation = "";
    }, 500);
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.unshift(newTask);
  saveData();
  inputBox.value = "";
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveData();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveData();
  renderTasks();
}

function clearAll() {
  if (tasks.length === 0) return;
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveData();
    renderTasks();
  }
}

function updateStats() {
  const pendingCount = tasks.filter((t) => !t.completed).length;
  if (tasks.length === 0) {
    taskCount.textContent = "No tasks yet";
  } else if (pendingCount === 0) {
    taskCount.textContent = "All done! 🎉";
  } else {
    taskCount.textContent = `${pendingCount} task${pendingCount !== 1 ? "s" : ""} left`;
  }
}

function saveData() {
  localStorage.setItem("taskmaster_data", JSON.stringify(tasks));
}

inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderTasks();
  });
});

renderTasks();
