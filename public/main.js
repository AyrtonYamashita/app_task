// Criado um array para armazenar as tarefas
let tasks = [];

// Função para adicionar uma nova tarefa
function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    if (taskText !== "") {
        const task = {
            id: Date.now(),
            text: taskText,
            check: false
        };
        saveTask(task).then(() => {
            fetchTask();
            taskInput.value = '';
        })
        tasks.push(task);
        input.value = "";
    }
}

// // Função para mostrar as tarefas na lista
// function renderTask(){
//     const taskList = document.getElementById("taskList");
//     taskList.innerHTML = "";

//     tasks.forEach((task) => {
//         const taskItem = document.createElement("div");
//         if (task.check){
//             taskItem.classList.add("complete-task");
//         }else {
//             taskItem.classList.add("task");
//         }
//         taskItem.innerHTML = `
//         <button onclick="checkList(${task.id})" class="task-check">✔</button>
//         <span class="task-text">${task.text}</span>
//         <button onclick="orderTask(${task.id})" class="order-task">⬇</button>
//         <button onclick="confirmDeleteTask(${task.id})" class="task-delete">🗑️</button>`;
//         taskList.appendChild(taskItem);
//     });
// }

async function loadTask() {
    const tasks = await fetchTask();
        tasks.map((tarefa) => {
            const taskItem = document.createElement("div");
            if (tarefa.check){
                taskItem.classList.add("complete-task");
            }else {
                taskItem.classList.add("task");
            }
            taskItem.innerHTML = `
            <button onclick="checkList(${tarefa.id})" class="task-check">✔</button>
            <span class="task-text">${tarefa.text}</span>
            <button onclick="orderTask(${tarefa.id})" class="order-task">⬇</button>
            <button onclick="confirmDeleteTask(${tarefa.id})" class="task-delete">🗑️</button>`;
            taskList.appendChild(taskItem);
        })
        
}

// Função para buscar as tarefas do servidor
async function fetchTask() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    return tasks;
}

// Função para marcar a tarefa como concluida
function checkList(tarefaId) {
    filtrado = tasks.filter((tarefa) => tarefa.id === tarefaId);
    // const task = filtrado[0];
    // task.check = !task.check;
    console.log(filtrado);
}
// Função para ordenar uma tarefa
function orderTask(taskId) {
    currentIndex = tasks.findIndex((task) => task.id === taskId);
    const newIndex = currentIndex + 1;
    if (newIndex < tasks.length) {
        const currentTask = tasks.splice(currentIndex, 1);
        tasks.splice(newIndex, 0, currentTask[0]);
        fetchTask();
    }
}

// Função para exibir a mensagem de confirmação antes de excluir uma task
function confirmDeleteTask(taskId) {
    if (confirm("Tem certeza que deseja remover esta tarefa?")) {
        deleteTask();
    }
}

// // Função para excluir uma tarefa
// function removeTask(taskId) {
//     tasks = tasks.filter((task) => task.id !== taskId);
//     console.log(tasks);
// }

async function saveTask(task) {
    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error('Falha ao salvar a tarefa!');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


async function deleteTask(task) {
    fetch(`/tasks/${task}`, {
        method: 'DELETE'
    })
}
loadTask();