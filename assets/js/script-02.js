const todoInput = document.querySelector(".todo-input");
const addBtn = document.querySelector(".todo-add-btn");
const todoList = document.querySelector(".todo-list");
const clearAllBtn = document.querySelector(".clear-all-btn");
const todoTemplate = document.querySelector("#todo-template");
const errorMessage = document.querySelector(".todo-error-message");

// Load todos when page loads
document.addEventListener("DOMContentLoaded", loadTodos);

// Add Todo
function addTodo() {
  const taskText = todoInput.value.trim();
  if (taskText === "") {
    todoInput.classList.add("error");
    todoInput.classList.add("shake");
    setTimeout(() => {
      todoInput.classList.remove("shake");
    }, 300);
    return;
  }
  addTodoToDOM(taskText);
  saveTodo(taskText);
  toggleClearButton();
  todoInput.value = "";
}

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTodo();
  }
});

todoInput.addEventListener("input", () => {
  const value = todoInput.value.trim();
  if (value !== "") {
    todoInput.classList.remove("error");
    errorMessage.classList.add("hidden");
  }
});

// Function to create todo HTML
function addTodoToDOM(taskText) {
  const todoClone = todoTemplate.content.cloneNode(true);
  todoClone.querySelector(".todo-list-task").textContent = taskText;
  todoList.appendChild(todoClone);
}

// Save todo to localStorage
function saveTodo(task) {
  let todos = getTodos();
  todos.push(task);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Get todos from localStorage
function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

// Load todos on refresh
function loadTodos() {
  const todos = getTodos();
  todos.forEach((todo) => {
    addTodoToDOM(todo);
  });
  toggleClearButton();
}

// Delete Todo
function deleteTodo(button) {
  const listItem = button.parentElement.parentElement;
  const taskText = listItem.querySelector(".todo-list-task").innerText;
  removeTodoFromStorage(taskText);
  listItem.remove();
  toggleClearButton();
}

// Remove todo from localStorage
function removeTodoFromStorage(taskText) {
  let todos = getTodos();
  todos = todos.filter((todo) => todo !== taskText);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Edit Todo
function editTodo(button) {
  const listItem = button.parentElement.parentElement;
  const taskSpan = listItem.querySelector(".todo-list-task");
  const oldText = taskSpan.innerText;
  const saveBtn = listItem.querySelector(".todo-save-btn");
  const cancelBtn = listItem.querySelector(".todo-cancel-btn");
  const deleteBtn = listItem.querySelector(".todo-delete-btn");

  taskSpan.innerHTML = ` <input type="text" class="todo-edit-input" value="${oldText}">
  `;
  const editInput = taskSpan.querySelector(".todo-edit-input");
  editInput.focus();
  editInput.select();
  button.classList.add("hidden");
  deleteBtn.classList.add("hidden");
  saveBtn.classList.remove("hidden");
  cancelBtn.classList.remove("hidden");

  saveBtn.setAttribute("onclick", "saveTodoEdit(this)");
  cancelBtn.setAttribute("onclick", `cancelEdit(this, '${oldText}')`);

  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveBtn.click();
    }

    if (event.key === "Escape") {
      cancelBtn.click();
    }
  });
}

function saveTodoEdit(button) {
  const listItem = button.parentElement.parentElement;
  const input = listItem.querySelector(".todo-edit-input");
  const newText = input.value.trim();

  if (!newText) return;

  const oldText = input.defaultValue;
  updateTodoInStorage(oldText, newText);
  listItem.querySelector(".todo-list-task").textContent = newText;

  const deleteBtn = listItem.querySelector(".todo-delete-btn");
  const saveBtn = button;
  const editBtn = listItem.querySelector(".todo-edit-btn");
  const cancelBtn = listItem.querySelector(".todo-cancel-btn");

  saveBtn.classList.add("hidden");
  cancelBtn.classList.add("hidden");
  editBtn.classList.remove("hidden");
  deleteBtn.classList.remove("hidden");
}

function cancelEdit(button, oldText) {
  const listItem = button.parentElement.parentElement;

  listItem.querySelector(".todo-list-task").textContent = oldText;

  const editBtn = listItem.querySelector(".todo-edit-btn");

  const cancelBtn = button;
  const deleteBtn = listItem.querySelector(".todo-delete-btn");
  const saveBtn = listItem.querySelector(".todo-save-btn");
  saveBtn.classList.add("hidden");
  cancelBtn.classList.add("hidden");
  editBtn.classList.remove("hidden");
  deleteBtn.classList.remove("hidden");
}

// Update localStorage after edit
function updateTodoInStorage(oldText, newText) {
  let todos = getTodos();
  todos = todos.map((todo) => {
    return todo === oldText ? newText : todo;
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Clear All
function toggleClearButton() {
  const todos = getTodos();
  if (todos.length > 1) {
    clearAllBtn.style.display = "block";
  } else {
    clearAllBtn.style.display = "none";
  }
}

clearAllBtn.addEventListener("click", () => {
  todoList.innerHTML = "";
  localStorage.removeItem("todos");
  toggleClearButton();
});
