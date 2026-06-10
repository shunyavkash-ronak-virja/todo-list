const todoInput = document.querySelector(".todo-input");
const addBtn = document.querySelector(".todo-add-btn");
const todoList = document.querySelector(".todo-list");
const clearAllBtn = document.querySelector(".clear-all-btn");

// Load todos when page loads
document.addEventListener("DOMContentLoaded", loadTodos);

// Add Todo
addBtn.addEventListener("click", () => {
  const taskText = todoInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  addTodoToDOM(taskText);
  saveTodo(taskText);

  todoInput.value = "";
});

// Clear All
clearAllBtn.addEventListener("click", () => {
  todoList.innerHTML = "";
  localStorage.removeItem("todos");
});

// Function to create todo HTML
function addTodoToDOM(taskText) {
  const newTodoHTML = `
        <li>
            <span class="todo-list-task">${taskText}</span>
            <div class="todo-item-btn-wrapper">
                <button class="todo-item-btn todo-edit-btn flex-1" type="button" onclick="editTodo(this)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="todo-item-btn-icon lucide lucide-pencil-icon lucide-pencil">
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                    <path d="m15 5 4 4" />
                    </svg>
                </button>
                <button class="todo-item-btn todo-delete-btn flex-1" type="button" onclick="deleteTodo(this)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="todo-item-btn-icon lucide lucide-trash-icon lucide-trash">
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </li>
  `;

  todoList.insertAdjacentHTML("beforeend", newTodoHTML);
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
}

// Delete Todo
function deleteTodo(button) {
  const listItem = button.parentElement.parentElement;
  const taskText = listItem.querySelector(".todo-list-task").innerText;
  removeTodoFromStorage(taskText);
  listItem.remove();
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
