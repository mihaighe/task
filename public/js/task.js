const taskForm = document.querySelector("#taskForm");
const taskDescription = document.querySelector("#taskDescription");
const descending = document.querySelector("#descending");
const ascending = document.querySelector("#ascending");
const finished = document.querySelector("#finished");
const unfinished = document.querySelector("#unfinished");

document.addEventListener("DOMContentLoaded", init);

function init() {
  token = localStorage.getItem("token");
  if (token != null) getTasks("asc");
  else document.getElementById("myTarget").remove();
}

function getTasks(sortQuery, completedQuery) {
  if (completedQuery != undefined)
    taskUrl =
      "/tasks?sortby=createdAt:" + sortQuery + "&completed=" + completedQuery;
  else taskUrl = "/tasks?sortBy=createdAt:" + sortQuery;

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
        var renderTask = `<div id="${task._id}" class="task">
            <div>${task.description}</div>
            <div>${formatedDate}
            <button class="deleteButton"><i class="fas fa-eraser"></i></button>
            <button class="deleteButton"><i class="fas fa-pen-square"></i></button>
            <input style="margin-left: 6px" class="w3-check w3-black" type="checkbox" ${checked}>
            </div>
        </div>`;
        container.innerHTML += renderTask;
      });
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

ascending.addEventListener("click", () => {
  getTasks("asc");
});

descending.addEventListener("click", () => {
  getTasks("desc");
});

finished.addEventListener("click", () => {
  getTasks(undefined, "true");
});

unfinished.addEventListener("click", () => {
  getTasks(undefined, "false");
});
