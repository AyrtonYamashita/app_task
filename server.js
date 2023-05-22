const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname + '/public'});
});

app.get('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if(err){
            console.log(err);
            return res.status(500).json({ error: 'Erro ao ler as tarefas!'});
        }
        let tasks = [];
        if (data) {
          try {
            tasks = JSON.parse(data);
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao ler o arquivo JSON' });
          }
        }
    
        res.json(tasks);
    });
});

app.post('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if(err){
            console.log(err);
            return res.status(500).json({error: 'Erro ao ler as tarefas!'});
        }

        let tasks = [];
        if (data) {
          try {
            tasks = JSON.parse(data);
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to parse tasks JSON' });
          }
        }
        const newTask = req.body;
        tasks.push(newTask);
        fs.writeFile('tasks.json', JSON.stringify(tasks), 'utf8', (err) => {
            if(err){
                console.error(err);
                return res.status(500).json({ error: 'Erro ao salvar as tarefas!'});
            }
            res.json(newTask);
        });
    });
});

app.delete('/tasks/:id', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if(err){
            console.log(err);
            return res.status(500).json({error: 'Erro ao ler as tarefas!'});
        }

        let tasks = [];
        if(data){
            try {
                tasks = JSON.parse(data);
            } catch (error){
                console.error(error);
                return res.status(500).json({error: 'Erro ao ler o arquivo JSON'});  
            }
        }
        const taskId = req.params.id;
        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        if(taskIndex === -1){
            return res.status(404).json({error: 'Tarefa não encontrada!'});
        }
        tasks.splice(taskIndex, 1);
        fs.writeFile('tasks.json', JSON.stringify(tasks), 'utf8', (err) => {
            if (err){
                console.error(err);
                return res.status(500).json({error: 'Erro ao deletar a tarefa'});
            }
            res.json({concluido: true});
        })
    })
})

app.listen(3000, () => {
    console.log(`Servidor ativo!`);
});