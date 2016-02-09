/**
 * Created by home on 2/7/16.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-databse.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync().then(function(){
    console.log("Everything is synced");

        return Todo.findById(2);
    /*Todo.create({
        description: 'Go to work'
    }).then(function(todo){
        console.log('Done!');
        console.log(todo);
    }).catch(function(e){
        console.log(e);
    });*/
}).then(function(todo){
    if(todo){
        console.log(todo.toJSON());
    } else {
        console.log('Value not found');
    }
});