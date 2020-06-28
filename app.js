const express = require('express');
const fs = require('fs');
const bdparse = require('body-parser');
const sanitize = require('sanitize-html');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://127.0.0.1/todo');

app.set('view engine', 'ejs');
app.use(bdparse.urlencoded({extended: true}));

var tmplist = [
    "First to do",
    "Second to do"
];

var todoSchema = new mongoose.Schema({
    name: String
});
var Todo = mongoose.model("Todo", todoSchema);

app.get('/', (req, res) => {
    Todo.find({}, (err, todoList) => {
        if(err){
            console.log(err);
            throw err;
        }
        else{
            res.render("../index.ejs", {todoList: todoList}); //views 폴더가 디폴트 탐색 위치이다.
        }
    }); 
});

app.post('/new_todo', (req, res) => {
    console.log("New data: " + req.body.todo);
    var newTodo = sanitize(req.body.todo);
    var newItem = new Todo({
        name: newTodo
    });
    Todo.create(newItem, (err, Todo) =>{ // Java static method랑 비슷한건가? 뭐지
        if(err){
            console.log(err);
            throw err;
        }
        else{
            console.log("Inserted" + newItem);
        }
    });
    res.redirect('/');
});

app.get('*', (req, res) =>{
    res.send("Page not found.");
});

app.listen(3000, '127.0.0.1', () => {
    console.log("Listening at port 3000...");  
});