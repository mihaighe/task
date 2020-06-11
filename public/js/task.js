const taskForm = document.querySelector('#taskForm')
const taskDescription = document.querySelector('#taskDescription')
const descending = document.querySelector('#descending')
const ascending = document.querySelector('#ascending')
const finished = document.querySelector('#finished')
const unfinished = document.querySelector('#unfinished')

document.addEventListener('DOMContentLoaded', init)

function init() {
    token = localStorage.getItem('token')
    if (token != null) getTasks('asc')
    else document.getElementById("myTarget").remove();

   
}

function getTasks(sortQuery, completedQuery) {

    if (completedQuery != undefined) taskUrl = '/tasks?sortby=createdAt:' + sortQuery + '&completed=' + completedQuery
    else taskUrl = '/tasks?sortBy=createdAt:' + sortQuery

    fetch(taskUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
        .then(tasks => {
            let id = 0
            let str = '<ul class="w3-ul w3-card-4">'
            tasks.forEach(task => {
                str += '<li class="w3-bar"><i class="fas fa-pen"></i>'
                str += '<div class="w3-bar-item" id=' + id +'>'; id++
                if (task.completed == true) str += '<input class="w3-check" checked="true" type="checkbox">'
                else str += '<input class="w3-check" type="checkbox">'
                str += '<span style="padding-left: 10px" class="w3-large">' + task.description + '</span><button class="w3-button" id="deleteButton">X</button></div></li>'
            })
            str += '</ul>'
            document.getElementById("taskContainer").innerHTML = str;
        })
}


taskForm.addEventListener('submit', (e) => {
    token = localStorage.getItem('token')

    const task = {
        description: taskDescription.value,
    }

    fetch('/tasks?', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(task)
    })
        .then(res => res.json())
        .then(data => {

        })
})

ascending.addEventListener('click', () => {
    getTasks('asc')
})

descending.addEventListener('click', () => {
    getTasks('desc')
})

finished.addEventListener('click', () => {
    getTasks(undefined, 'true')
})

unfinished.addEventListener('click', () => {
    getTasks(undefined, 'false')
})

