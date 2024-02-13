// Get Elements
let inp = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let deleteAll = document.querySelector(".delete-all");
let searchInput = document.querySelector("#searchInput");
let btnDark = document.getElementById("dark");

if (localStorage.getItem("theme") === "dark") {
  let createDark = document.createElement("link");
  createDark.rel = "stylesheet";
  createDark.href = "dark.css";
  document.head.appendChild(createDark);
}

if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "light");
}

btnDark.onclick = function () {
  if (localStorage.getItem("theme") === "dark") {
    localStorage.setItem("theme", "light");
    document.head.querySelector('[href="dark.css"]').remove();
  } else {
    localStorage.setItem("theme", "dark");
    let createDark = document.createElement("link");
    createDark.rel = "stylesheet";
    createDark.href = "dark.css";
    document.head.appendChild(createDark);
  }
};

// Empty Array To Store The Tasks
let arrayOfTasks = [];

if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

getDataToLocalStorage();

// Add Task
submit.addEventListener("click", function () {
  if (inp.value != "") {
    addTaskToArray(inp.value);
    inp.value = "";
  }
});

inp.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (inp.value != "") {
      addTaskToArray(inp.value);
      inp.value = "";
    }
  }
});

tasksDiv.addEventListener("click", function (e) {
  if (e.target.classList.contains("del")) {
    // Remove Element Form Local Storage
    let taskId =
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-id"
      );
    deleteTaskWith(taskId);
    // Remove Element Form Page
    e.target.parentElement.parentElement.parentElement.remove();
  }
  if (e.target.classList.contains("edit")) {
    let taskId =
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-id"
      );
    let newText = prompt("Enter The New Text:");
    if (newText !== null) {
      editTask(taskId, newText);
    }
  }
  if (e.target.classList.contains("task")) {
    toggleStatusTask(e.target.getAttribute("data-id"));
    e.target.classList.toggle("done");
  }
});

searchInput.addEventListener("input", function () {
  let searchText = this.value.toLowerCase();
  let filteredTasks = arrayOfTasks.filter((task) =>
    task.title.toLowerCase().includes(searchText)
  );
  addElementsToPage(filteredTasks);
});

function addTaskToArray(textTask) {
  // Task Data
  let task = {
    id: Date.now(),
    title: textTask,
    complated: false,
  };

  arrayOfTasks.push(task);

  // Add Tasks To Page
  addElementsToPage(arrayOfTasks);

  // Add Tasks To Local Storage
  addDataToLocalStorage(arrayOfTasks);

  // Show delete-all button
  deleteAll.style.display = "block";
}
function addElementsToPage(arrayOfTasks) {
  tasksDiv.innerHTML = "";

  arrayOfTasks.forEach((task) => {
    tasksDiv.innerHTML += `<div class="task ${
      task.complated ? "done" : ""
    }"data-id="${task.id}">
                <div class="task-title">
                ${task.title}
                </div>
                <div class="task-btns">
                <span><ion-icon class="edit" name="create-outline"></ion-icon></span>
                <span><ion-icon class="del" name="trash-outline"></ion-icon></span>
                <span class="drag-drop"><ion-icon name="menu"></ion-icon></span>
                </div>
                </div>`;
  });

  // Update the delete-all button display
  if (arrayOfTasks.length < 2) {
    deleteAll.style.display = "none";
  } else {
    deleteAll.style.display = "block";
  }
}

function addDataToLocalStorage(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getDataToLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElementsToPage(tasks);
  }
}

function deleteTaskWith(id) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != id);
  addDataToLocalStorage(arrayOfTasks);

  // Check if the tasks list is empty
  if (arrayOfTasks.length < 2) {
    deleteAll.style.display = "none";
  }
}

function toggleStatusTask(taskid) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskid) {
      arrayOfTasks[i].complated == false
        ? (arrayOfTasks[i].complated = true)
        : (arrayOfTasks[i].complated = false);
    }
  }
  addDataToLocalStorage(arrayOfTasks);
}

function editTask(taskId, newText) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].title = newText;
      break;
    }
  }

  addElementsToPage(arrayOfTasks);
  addDataToLocalStorage(arrayOfTasks);
}

deleteAll.onclick = function () {
  tasksDiv.innerHTML = "";
  deleteAll.style.display = "none";
  arrayOfTasks = [];
  addDataToLocalStorage(arrayOfTasks);
};

new Sortable(tasksDiv, {
  animation: 150,
  ghostClass: "sortable-ghost",
  handle: ".drag-drop", // تحديد العنصر الذي يمكن منه السحب
  onEnd: function (evt) {
    let movedItem = arrayOfTasks.splice(evt.oldIndex, 1)[0];
    arrayOfTasks.splice(evt.newIndex, 0, movedItem);
    addDataToLocalStorage(arrayOfTasks);
  },
});

// window.localStorage.clear()
