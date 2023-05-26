const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Rota padrão que carrega a pagina inicial da minha aplicação
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

// Rota carrega as informações dentro do arquivo tasks.json
app.get('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Erro ao ler as tarefas!' });
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

// Rota que envia informações para dentro do arquivo tasks.json
app.post('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Erro ao ler as tarefas!' });
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
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao salvar as tarefas!' });
            }
            res.json(newTask);
        });
    });
});

// Rota que deleta as informações dentro do arquivo tasks.json
app.delete('/tasks/delete/:id', (req, res) => {
    fs.readFile('tasks.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON', err);
            return;
        }
        let tasks = [];
        tasks = JSON.parse(data);
        const tarefaId = parseInt(req.params.id);
        const tarefaIndex = tasks.findIndex(task => task.id !== tarefaId);
        tasks.splice(tarefaIndex, 1);
            fs.writeFile('tasks.json', JSON.stringify(tasks), 'utf-8', (err) => {
                if (err) {
                    console.error('Erro ao atualizar o arquivo JSON:', err);
                    res.status(500).send('Erro ao atualizar a tarefa!');
                    return;
                }
                res.send('Tarefa atualizada com sucesso!');
            });
    });
})

// Rota que sobrescreve os objetos dentro do arquivo tasks.json
app.post('/tasks/check/:id', (req, res) => {
    fs.readFile('tasks.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON', err);
            return;
        }
        let tasks = [];
        tasks = JSON.parse(data);
        const tarefaId = parseInt(req.params.id);
        const tarefaIndex = tasks.findIndex(task => task.id === tarefaId);
        if (tarefaIndex !== -1) {
            tasks[tarefaIndex].check = !tasks[tarefaIndex].check;
            fs.writeFile('tasks.json', JSON.stringify(tasks), 'utf-8', (err) => {
                if (err) {
                    console.error('Erro ao atualizar o arquivo JSON:', err);
                    res.status(500).send('Erro ao atualizar a tarefa!');
                    return;
                }
                res.send('Tarefa atualizada com sucesso!');
            });
        }else{
            res.status(404).send('Tarefa não encontrada')
        }
    });
})

// Rota que ordena a lista de tarefas
app.post('/tasks/order/:id', (req, res) => {
    fs.readFile('tasks.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON', err);
            return;
        }
        let tasks = [];
        tasks = JSON.parse(data);
        const tarefaId = parseInt(req.params.id);
        const tarefaIndex = tasks.findIndex(task => task.id === tarefaId);
        const newIndex = tarefaIndex + 1;
        if(newIndex < tasks.length){
            const currentTask = tasks.splice(tarefaIndex, 1);
            tasks.splice(newIndex, 0, currentTask[0]);
            fs.writeFile('tasks.json', JSON.stringify(tasks), 'utf-8', (err) => {
                if (err) {
                    console.error('Erro ao atualizar o arquivo JSON:', err);
                    res.status(500).send('Erro ao ordenar a tarefa!');
                    return;
                }
                res.send('Tarefa ordenada com sucesso!');
            });
        }else{
            res.status(404).send('Tarefa não encontrada');
        }
    });

})

app.listen(3000, () => {
    console.log(`Servidor ativo!`);
});