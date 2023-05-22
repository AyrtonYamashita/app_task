// Criado um array para armazenar as tarefas
let tasks = [];

// Função para adicionar uma nova tarefa
function addTask(){
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    if (taskText !== ""){
        const task = {
            id: Date.now(),
            text: taskText,
            check: false
        };
        saveTask(task).then(() => {
            renderTask(task);
            taskInput.value = '';
        })
        .catch((error) => {
            console.error(error);
        })
        tasks.push(task);
        input.value = "";
    }
    console.log(tasks);
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

// Função para ordenar uma tarefa
function orderTask(taskId){
    currentIndex = tasks.findIndex((task) => task.id === taskId);
    
    const newIndex = currentIndex + 1;
    if (newIndex < tasks.length){
        const currentTask = tasks.splice(currentIndex, 1);
        tasks.splice(newIndex, 0, currentTask[0]);
        renderTask();
     }
}

// Função para marcar a tarefa como concluida
function checkList(taskId){
    filtrado = tasks.filter((task) => task.id === taskId);
    const task = filtrado[0];
    task.check = !task.check;
    renderTask();
}

// Função para exibir a mensagem de confirmação antes de excluir uma task
function confirmDeleteTask(taskId){
    if (confirm("Tem certeza que deseja remover esta tarefa?")){
        removeTask(taskId);
    }
}

function removeTask(taskId) {
    const taskElement = document.getElementById(taskId);
    if (taskElement) {
      taskElement.remove();
    }
  }

// // Função para excluir uma tarefa
// function deleteTask(taskId){
//     tasks = tasks.filter((task) => task.id !== taskId);
//     renderTask();
// }

// Função para buscar as tarefas do servidor
async function fetchTasks() {
    try {
      const response = await fetch('/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await response.json();
      return tasks;
    } catch (error) {
      throw new Error(error.message);
    }
}

// Função para carregar as tarefas ao carregar a página
async function loadTasks() {
    try {
      const tasks = await fetchTasks();
      tasks.forEach((task) => {
        renderTask(task);
      });
    } catch (error) {
      console.error(error);
    }
}


async function saveTask(task){
    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok){
            throw new Error('Falha ao salvar a tarefa!');
        }
    }catch (error){
        throw new Error(error.message);
    }
}


async function deleteTask(taskId){
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
        if(!response.ok){
            throw new Error('Erro ao deletar a tarefa');
        }
        const deletedTask = await response.json();
        return deletedTask;
    }catch(error) {
        throw new Error(error.message);
    }
}

loadTasks();
renderTask();