// Selectors for DOM elements
const submitBtn = document.querySelector("#sumbit-btn");
const taskContainer = document.querySelector(".tasks-container");
const inputTitle = document.querySelector("#task-input-title");
const inputDescription = document.querySelector("#task-input-description");
const taskStatusDropdown = document.querySelector("#task-status");
const copyBtns = document.querySelectorAll("#copy-task-btn");

// Array to store tasks
let tasks = [];

// Variable to keep track of the previous ID
let preId = "";

// Function to generate a unique ID
const generateUniqueId = () => {
  let id = Math.floor(Math.random() * 100) + 1;

  // Compare with previous ID and generate a new random part if necessary
  while (id === preId) {
    id = Math.floor(Math.random() * 100) + 1;
  }

  preId = id;
  return id;
};

// Function to add a task to the DOM
const addTaskToDom = () => {
  if (inputTitle.value.trim() === "") {
    alert("Please provide a title for the task.");
    return;
  }

  // Create a new task object
  const task = {
    title: inputTitle.value,
    description: inputDescription.value,
    id: generateUniqueId(), // Generate a unique ID
    status: "todo",
  };

  // Add the task to the tasks array
  tasks.push(task);

  // Update the task list in the DOM and local storage
  const tasksJSON = JSON.stringify(tasks);
  localStorage.setItem("tasks", tasksJSON);
  updateTaskList();

  // Clear input fields
  inputTitle.value = "";
  inputDescription.value = "";
};

// Function to update the task list in the DOM
const updateTaskList = () => {
  const fragment = document.createDocumentFragment();

  // Iterate through tasks and create DOM elements
  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.dataset.id = task.id;

    // Populate the taskDiv with HTML content
    taskDiv.innerHTML = `
    <div class="text-content">
      <h3 id="task-title">${task.title}</h3>
      <p id="task-description">${task.description}</p>
      </div>
      <div class="user-actions">
        <!-- Dropdown for task status -->
        <select name="status" id="task-status" data-id="${task.id}">
          <option value="todo" ${
            task.status === "todo" ? "selected" : ""
          }>To-do</option>
          <option value="inprogress" ${
            task.status === "inprogress" ? "selected" : ""
          }>In Progress</option>
          <option value="completed" ${
            task.status === "completed" ? "selected" : ""
          }>Completed</option>
        </select>
        <div class="buttons">
        <!-- Button to copy task -->
        <button id="copy-task-btn" data-id="${task.id}">Copy</button>
        <!-- Button to remove task -->
        <button id="remove-task-btn" data-id="${task.id}">Remove</button>
        </div>
        </div>
    `;

    // Append taskDiv to fragment
    fragment.appendChild(taskDiv);
  });

  // Clear the taskContainer and append the fragment
  taskContainer.innerHTML = "";
  taskContainer.appendChild(fragment);
};

// Function to remove a task
const removeTask = (e) => {
  if (e.target.closest("#remove-task-btn")) {
    const taskId = e.target.dataset.id;

    // Find the index of the task with the specified ID
    const index = tasks.findIndex((task) => task.id === parseInt(taskId));

    if (index !== -1) {
      // Remove the task from the tasks array
      tasks.splice(index, 1);
      updateTaskList();

      // Update local storage with the modified tasks array
      const tasksJSON = JSON.stringify(tasks);
      localStorage.setItem("tasks", tasksJSON);
    }
  }
};

// Function to update the status of a task
const updateTaskStatus = (e) => {
  if (e.target.closest("#task-status")) {
    const taskStatus = e.target.value;
    const taskId = e.target.dataset.id;

    // Find the index of the task with the specified ID
    const index = tasks.findIndex((task) => task.id === parseInt(taskId));

    if (index !== -1) {
      // Update the status property of the task
      tasks[index].status = taskStatus;
      updateTaskList();

      // Update local storage with the modified tasks array
      const tasksJSON = JSON.stringify(tasks);
      localStorage.setItem("tasks", tasksJSON);
    }
  }
};

// Function to copy a task
const copyTask = (e) => {
  if (e.target.closest("#copy-task-btn")) {
    const taskId = e.target.dataset.id;

    // Find the index of the task with the specified ID
    const index = tasks.findIndex((task) => task.id === parseInt(taskId));

    if (index !== -1) {
      // Create a copy of the task and insert it after the original task
      const copiedTask = { ...tasks[index] };
      tasks.splice(index + 1, 0, copiedTask);
      updateTaskList();

      // Update local storage with the modified tasks array
      const tasksJSON = JSON.stringify(tasks);
      localStorage.setItem("tasks", tasksJSON);
    }
  }
};

// Function to attach event listeners
const handleEventListeners = () => {
  // Add task button click event
  submitBtn.addEventListener("click", addTaskToDom);
  // Task container click event (event delegation)
  taskContainer.addEventListener("click", (e) => {
    copyTask(e);
    removeTask(e);
  });
  // Task status dropdown change event (event delegation)
  taskContainer.addEventListener("change", updateTaskStatus);
};

// Call the handleEventListeners function on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  const storedTasksJSON = localStorage.getItem("tasks");

  if (storedTasksJSON) {
    tasks = JSON.parse(storedTasksJSON);
  }

  updateTaskList();
  handleEventListeners();
});
