const tok = localStorage.getItem("token");
window.addEventListener("load", () => {
  if (!localStorage.getItem("token")) {
    window.location.replace("login.html");
  }
});

// Fetch tasks from the API

const success = sessionStorage.getItem("success");
console.log(success);

if (success) {
  const toastText = document.querySelector("#toast-body");
  console.log(toastText);
  const myAlert = document.querySelector(".toast");
  const beAlert = new bootstrap.Toast(myAlert);
  toastText.textContent = "Successfully logged in";
  beAlert.show();

  sessionStorage.removeItem("success");
}

// console.log();

fetch("http://127.0.0.1:3000/api/v1/tasks", {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((response) => response.json())
  .then((data) => {
    const taskList = document.getElementById("task-list");

    const showUsername = document.querySelector(".showUser");
    showUsername.textContent = "Welcome! 👷‍♂️ " + data.data.user.name;
    // Iterate over the tasks and create HTML elements dynamically
    data.data.tasks.forEach((task) => {
      //HTML dynamic elements
      const card = document.createElement("div");
      const listItem = document.createElement("p");
      const descItem = document.createElement("span");
      const deleteElement = document.createElement("button");
      const editElement = document.createElement("button");
      const editIcon = document.createElement("i");
      const deleteIcon = document.createElement("i");
      const divButton = document.createElement("div");
      const outerTaskHeader = document.createElement("div");
      outerTaskHeader.classList.add("taskHeader");
      divButton.classList.add("buttonContainer");
      deleteIcon.classList.add("bi-trash");
      deleteIcon.classList.add("deleteIcon");
      deleteIcon.setAttribute("data-taskId", task._id);
      editIcon.classList.add("bi-pencil-square");
      editIcon.classList.add("editButton");
      editIcon.setAttribute("data-taskIdUpdate", task._id);
      editElement.appendChild(editIcon);
      deleteElement.appendChild(deleteIcon);
      deleteElement.classList.add("delete");
      editElement.classList.add("edit");

      card.classList.add("card");
      //coloring task status
      if (task.completed) {
        card.classList.add("completed");
      }
      listItem.textContent = task.name;
      descItem.textContent = task.description;
      taskList.appendChild(card);
      card.appendChild(outerTaskHeader);
      outerTaskHeader.appendChild(listItem);
      outerTaskHeader.appendChild(divButton);
      divButton.appendChild(deleteElement);
      divButton.appendChild(editElement);
      card.appendChild(descItem);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const addTask = async (task) => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(task),
  });
  const data = await response.json();

  alert("Task added successfully");
};

const addTaskForm = document.getElementById("addTaskForm");

addTaskForm.addEventListener("submit", async (e) => {
  //   e.preventDefault();
  const taskName = addTaskForm.taskName.value;
  const taskDescription = addTaskForm.taskDescription.value;
  const taskCompleted = addTaskForm.taskCompleted.checked;

  const task = {
    name: taskName,
    description: taskDescription,
    completed: taskCompleted,
  };
  await addTask(task);
});

const deleteTask = async (taskId) => {
  const response = await fetch(`http://127.0.0.1:3000/api/v1/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  const data = await response.json();
};

const editTaskModal = document.querySelector("#editModal");

//taskID stored here
let updatedTaskID = "";
//
document.addEventListener("click", (e) => {
  //delete task
  if (e.target.classList.contains("deleteIcon")) {
    const taskId = e.target.getAttribute("data-taskId");
    deleteTask(taskId);
    // alert("Task deleted");
    window.location.reload();
  }

  //edit task
  if (e.target.classList.contains("editButton")) {
    editTaskModal.showModal();
    updatedTaskID = e.target.getAttribute("data-taskIdUpdate");
    fetch(`http://127.0.0.1:3000/api/v1/tasks/${updatedTaskID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        editTaskModal.querySelector("#editTaskName").value =
          data.data.task.name;
        editTaskModal.querySelector("#editTaskDescription").value =
          data.data.task.description;
        editTaskModal.querySelector("#editTaskCompleted").checked =
          data.data.task.completed;
      });
  }
});

//edit task

const updateTask = async (task) => {
  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/tasks/${updatedTaskID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(task),
    }
  );
  const data = await response.json();
};
const updateTaskForm = document.getElementById("updateTaskForm");

updateTaskForm.addEventListener("submit", async (e) => {
  //   e.preventDefault();
  const taskName = updateTaskForm.taskName1.value;
  const taskDescription = updateTaskForm.taskDescription1.value;
  const taskCompleted = updateTaskForm.taskCompleted1.checked;

  const task = {
    name: taskName,
    description: taskDescription,
    completed: taskCompleted,
  };
  await updateTask(task);
});

//LOGOUT BUTTON
const logoutButton = document.querySelector("#logout");

logoutButton.addEventListener("click", async (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  // console.log(localStorage.getItem("token"));
  window.location.replace("login.html");
});
