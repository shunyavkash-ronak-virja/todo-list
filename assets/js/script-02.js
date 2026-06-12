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
    alert("Please enter a task!");
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
  const newText = prompt("Edit your task:", oldText);

  if (newText !== null && newText.trim() !== "") {
    taskSpan.innerText = newText.trim();
    updateTodoInStorage(oldText, newText.trim());
  }
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
