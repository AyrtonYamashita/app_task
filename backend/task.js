// Criado um array para armazenar as tarefas
let tasks = [];

// Função para adicionar uma nova tarefa
function addTask(){
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText !== ""){
        const task = {
            id: Date.now(), // Gerando um ID unico para cada tarefa
            text: taskText
        };
        tasks.push(task);
        input.value = "";
        renderTask();
    }
}

// Função para mostrar as tarefas na lista
function renderTask(){
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task");
        taskItem.innerHTML = `
        <span class="task-text">${task.text}</span>
        <button onclick="confirmDeleteTask(${task.id})" class="task-delete">&#128465</button>`;
        taskList.appendChild(taskItem);
    });
}

// Função para exibir a mensagem de confirmação antes de excluir uma task
function confirmDeleteTask(taskId){
    if (confirm("Tem certeza que deseja remover esta tarefa?")){
        deleteTask(taskId);
    }
}

// Função para excluir uma tarefa

function deleteTask(taskId){
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTask();
}

// Chama a função renderTask para exibir as tarefas iniciais
renderTask();