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
            .catch((error) => {
                console.error(error);
            })
        tasks.push(task);
        input.value = "";
    }
}

// Função para mostrar as tarefas na lista
function renderTask(){
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const taskItem = document.createElement("div");
        if (task.check){
            taskItem.classList.add("complete-task");
        }else {
            taskItem.classList.add("task");
        }
        taskItem.innerHTML = `
        <button onclick="checkList(${task.id})" class="task-check">✔</button>
        <span class="task-text">${task.text}</span>
        <button onclick="orderTask(${task.id})" class="order-task">⬇</button>
        <button onclick="confirmDeleteTask(${task.id})" class="task-delete">🗑️</button>`;
        taskList.appendChild(taskItem);
    });
}

// Função para buscar as tarefas do servidor
function fetchTask() {
    fetch("/tasks").then((res) => {
        res.json().then((dados) => {
            dados.map((tarefa) => {
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
            });
        })

    })
}

// Função para ordenar uma tarefa
function orderTask(tarefaId) {
    currentIndex = tasks.findIndex((tarefa) => tarefa.id === tarefaId);
    console.log(currentIndex);

    const newIndex = currentIndex + 1;
    if (newIndex < tasks.length) {
        const currentTask = tasks.splice(currentIndex, 1);
        tasks.splice(newIndex, 0, currentTask[0]);
        fetchTask();
    }
}

// Função para marcar a tarefa como concluida
function checkList(taskId) {
    filtrado = tasks.filter((task) => task.id === taskId);
    const task = filtrado[0];
    task.check = !task.check;
    fetchTask();
}

// Função para exibir a mensagem de confirmação antes de excluir uma task
function confirmDeleteTask(taskId) {
    if (confirm("Tem certeza que deseja remover esta tarefa?")) {
        removeTask(taskId);
    }
}

// Função para excluir uma tarefa
function removeTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    deleteTask();

}

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


async function deleteTask(taskId) {
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar a tarefa');
        }
        const deletedTask = await response.json();
        return deletedTask;
    } catch (error) {
        throw new Error(error.message);
    }
}
fetchTask();