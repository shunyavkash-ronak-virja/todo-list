const todoInput = document.querySelector(".todo-input");
const addBtn = document.querySelector(".todo-add-btn");
const todoList = document.querySelector(".todo-list");
const clearAllBtn = document.querySelector(".clear-all-btn");
const todoTemplate = document.querySelector("#todo-template");

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
  const newTodo = saveTodo(taskText);
  addTodoToDOM(newTodo);
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
  }
});

// Function to create todo HTML
function addTodoToDOM(todo) {
  const todoClone = todoTemplate.content.cloneNode(true);
  const li = todoClone.querySelector("li");
  li.dataset.id = todo.id;
  todoClone.querySelector(".todo-list-task").textContent = todo.text;
  todoList.appendChild(todoClone);
}

// Save todo to localStorage
function saveTodo(task) {
  let todos = getTodos();
  const newTodo = {
    id: Date.now(),
    text: task,
  };
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
  return newTodo;
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
  const listItem = button.closest("li");
  const id = Number(listItem.dataset.id);
  removeTodoFromStorage(id);
  listItem.remove();
  toggleClearButton();
}

// Remove todo from localStorage
function removeTodoFromStorage(id) {
  let todos = getTodos();
  todos = todos.filter((todo) => todo.id !== id);
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

  const id = Number(listItem.dataset.id);
  updateTodoInStorage(id, newText);
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
function updateTodoInStorage(id, newText) {
  let todos = getTodos();
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.text = newText;
    }
    return todo;
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Clear All
function toggleClearButton() {
  const totalTasks = todoList.querySelectorAll("li").length;
  clearAllBtn.style.display = totalTasks > 1 ? "block" : "none";
}

clearAllBtn.addEventListener("click", () => {
  todoList.innerHTML = "";
  localStorage.removeItem("todos");
  toggleClearButton();
});
