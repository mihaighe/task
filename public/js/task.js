const taskForm = document.querySelector("#taskForm");
const taskDescription = document.querySelector("#taskDescription");
const oldest = document.querySelector("#oldest");
const finished = document.querySelector("#finished");
const unfinished = document.querySelector("#unfinished");

document.addEventListener("DOMContentLoaded", init);

document.body.addEventListener("click", function (event) {
  secondClass = event.target.classList[1];
  firstClass = event.target.classList[0];

  if (secondClass == "fa-pen-square") {
    id = event.target.parentElement.parentElement.id;
    element = event.target.parentElement.parentElement.previousElementSibling;
    text = element.innerText;
    element.innerHTML = `<form id="subForm"><input id="subDesc" class="w3-input w3-border taskInput" autocomplete="off" placeholder="${text}" type="text"></form>`;
    subForm = document.querySelector("#subForm");
    subDesc = document.querySelector("#subDesc");
    subForm.addEventListener("submit", (e) => {
      updateTask(id, subDesc.value)
    });
  } else if (secondClass == "fa-eraser") {
    id = event.target.parentElement.parentElement.id;
    element = event.target.parentElement.parentElement.parentElement;
    deleteTask(element, id);
  } else if (firstClass == "w3-check") {
    id = event.target.parentElement.id;
    flag = event.target.checked;
    updateTask(id, flag);
  }
});

function myFunction(id, text) {
  console.log(id);
  console.log(text);
}

function init() {
  token = localStorage.getItem("token");
  if (token != null) getTasks("oldest");
  else document.getElementById("myTarget").remove();
}

let finish = false;
let unfinish = false;
let old = true;

function deleteTask(element, id) {
  fetch(`/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => {
    if (res.status == 200) {
      element.remove();
    }
  });
}

function updateTask(id, value) {
  if (value == true || value == false) {
    task = {
      completed: value,
    };
  } else {
    task = {
      description: value,
    };
  }

  fetch(`/task/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(task),
  }).then();
}

function getTasks(status) {
  if (status == "finish") {
    finish = !finish;
  } else if (status == "unfinish") {
    unfinish = !unfinish;
  } else if ((status = "oldest")) {
    old = !old;
  }

  if (old == 1) {
    sort = "asc";
    oldest.innerText = "Old first";
  } else {
    sort = "desc";
    oldest.innerText = "New first";
  }

  if (finish == 1 && unfinish == 0) {
    finished.classList.add("active");
    unfinished.classList.remove("active");
    completed = true;
  } else if (finish == 0 && unfinish == 1) {
    finished.classList.remove("active");
    unfinished.classList.add("active");
    completed = false;
  } else {
    completed = "";
  }

  if (finish == 1 && unfinish == 1) {
    finished.classList.add("active");
    unfinished.classList.add("active");
  } else if (finish == 0 && unfinish == 0) {
    finished.classList.remove("active");
    unfinished.classList.remove("active");
  }

  taskUrl = "/tasks?sortBy=createdAt:" + sort + "&completed=" + completed;

  fetch(taskUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((tasks) => {
      container = document.getElementById("taskContainer");
      container.innerHTML = "";

      tasks.forEach((task) => {
        formatedDate = formatDate(task.updatedAt);
        checked = task.completed ? "checked" : "";
        var renderTask = `<div  class="task">
            <div>${task.description}</div>
            <div id="${task._id}">${formatedDate}
            <button class="deleteButton"><i class="fas fa-eraser"></i></button>
            <button class="deleteButton"><i class="fas fa-pen-square"></i></button>
            <input style="margin-left: 6px" class="w3-check w3-black" type="checkbox" ${checked}>
            </div>
        </div>`;
        container.innerHTML += renderTask;
      });

      // deleteButton = document.querySelector("#deleteButton");
      // deleteButton.addEventListener('click', (e) => {
      //   e.preventDefault()
      //   console.log('works');
      // })
    });
}

function formatDate(date) {
  var month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";

  myDate = new Date(Date.parse(date));
  m = month[myDate.getMonth()];
  d = myDate.getDate();
  hh = myDate.getHours();
  mm = myDate.getMinutes();

  d = d < 10 ? `0${d}` : d;
  hh = hh < 10 ? `0${hh}` : hh;
  mm = mm < 10 ? `0${mm}` : mm;

  return `${m} ${d} - ${hh}:${mm}`;
}

taskForm.addEventListener("submit", (e) => {
  token = localStorage.getItem("token");

  const task = {
    description: taskDescription.value,
  };

  fetch("/tasks?", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(task),
  })
    .then((res) => res.json())
    .then((data) => {});
});

oldest.addEventListener("click", () => {
  getTasks("oldest");
});

finished.addEventListener("click", () => {
  getTasks("finish");
});

unfinished.addEventListener("click", () => {
  getTasks("unfinish");
});
