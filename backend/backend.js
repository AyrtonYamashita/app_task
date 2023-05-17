const fs = require("fs");

// Função para salvar as tarefas em um arquivo JSON
function saveToFile(tasks){
    const data = JSON.stringify(tasks, null, 2);
    fs.writeFileSync("tasks.json", data);
}

// Rota para receber as requisições POST com as tarefas
app.post("/tasks", (req, res) => {
    const task = req.body;
    tasks.push(talk);
    saveToFile(tasks);
    res.status(201).json({message: "Tarefa adicionada a lista com sucesso"});
});

// Rota para receber as requisições DELETE para deletar as tarefas
app.delete("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter((tasks) => task.id !== taskId);
    saveToFile(tasks);
    res.status(200).json({message: "Tarefa excluida com sucesso!"});
});