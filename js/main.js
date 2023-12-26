const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach((task) => renderTask(task));
}

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", completeTask);
checkEmptyList();

function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    tasks.push(newTask);
    saveToLocalStorage();

    renderTask(newTask);

    //Очистка инпута и фокус на него
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(e) {
    if (e.target.dataset.action !== "delete") return;

    const parentNode = e.target.closest(".list-group-item");

    const parentID = Number(parentNode.id);

    const parentIndex = tasks.findIndex((task) => task.id === parentID);
    tasks.splice(parentIndex, 1);
    // tasks.filter((task) => task.id === parentID);
    parentNode.remove();
    checkEmptyList();
    saveToLocalStorage();
}

function completeTask(e) {
    if (e.target.dataset.action == "done") {
        const parentNode = e.target.closest(".list-group-item");

        const id = Number(parentNode.id);
        const task = tasks.find((task) => task.id === id);
        task.done = !task.done;
        saveToLocalStorage();

        const taskTitle = parentNode.querySelector(".task-title");
        taskTitle.classList.toggle("task-title--done");
    }
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
        tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
    }
    if (tasks.length > 0) {
        const emptyListElement = document.querySelector("#emptyList");
        emptyListElement ? emptyListElement.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
    const taskStatus = task.done ? "task-title task-title--done" : "task-title";
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${taskStatus}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

    // добавление новой задачи
    tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
