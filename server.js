/**
 * Created by home on 2/2/16.
 */

var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'Meet Pratik at 7:00 PM',
    location: 'Ajay Apartments, Aundh, Pune',
    completed: false
}, {
    id: 2,
    description: 'Complete Node.js course ASAP',
    location: 'home PC - tutorials online',
    completed: false
}, {
    id: 3,
    description: 'Go to DMart to get monthly groceries',
    location: 'DMart - Baner, Pune',
    completed: false
}];

app.get('/', function(req, res){
    res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res){
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;

    todos.forEach(function(todo){
        if (todoId === todo.id){
            matchedTodo = todo;
        }
    });

    if (matchedTodo){
        res.json(matchedTodo);
    } else {
        res.status(404).send('id does not exist');
    }
});

app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
})