// Criado um array para armazenar as tarefas
let tasks = [];

// Função para buscar as tarefas do servidor
async function fetchTask() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    return tasks;
}
// Função para carregar as tarefas
async function loadTask() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    const tasks = await fetchTask();
    tasks.map((tarefa) => {
        const taskItem = document.createElement("div");
        if (tarefa.check) {
            taskItem.classList.add("complete-task");
        } else {
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
            loadTask();
            taskInput.value = '';
        })
        tasks.push(task);
        input.value = "";
    }
}
// Função para marcar a tarefa como concluida
function checkList(tarefaId) {
    try {
        fetch(`/tasks/check/${tarefaId}`, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Falha ao atualizar a tarefa');
            }
            loadTask();
        });
    } catch (error) {
        console.error(error);
    }
}
// Função para ordenar uma tarefa
function orderTask(tarefaId) {
    try {
        fetch(`/tasks/order/${tarefaId}`, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }
        }).then(response =>{
            if(!response.ok){
                throw new Error ('Falha ao ordenar a tarefa');
            }
            loadTask();
        });
    }catch (error){
        console.error(error);
    }
} 
// Função para exibir a mensagem de confirmação antes de excluir uma task
function confirmDeleteTask() {
    if (confirm("Tem certeza que deseja remover esta tarefa?")) {
        removeTask();
    }
}
// Função para excluir uma tarefa
function removeTask(tarefaId) {
    fetch(`/tasks/delete/${tarefaId}`, {
        method: 'DELETE'
    }).then(response => {
        if(!response.ok){
            throw new Error ('Falha ao excluir a tarefa');
        }
        loadTask();
    })
}
// Função para salvar uma tarefa
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
loadTask();