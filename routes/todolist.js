var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // or your MySQL user
    password: '',        // or your MySQL password
    database: 'COMP206', // Your database name
    port: 3306
  });

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});


router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM todo_items', function(err, results) {
    if (err) {
      return next(err);
    }
    res.json(results);  
  });
});


router.post('/', function(req, res, next) {
  const { description, completed_ts } = req.body;

  connection.query('INSERT INTO todo_items (description, completed_ts) VALUES (?, ?)', [description, completed_ts], function(err, result) {
    if (err) {
      return next(err);
    }
    res.status(201).json({ message: 'Todo item added successfully', id: result.insertId });
  });
});


router.put('/:id', function(req, res, next) {
  const { id } = req.params;
  const { description, completed_ts } = req.body;

  connection.query('UPDATE todo_items SET description = ?, completed_ts = ? WHERE id = ?', [description, completed_ts, id], function(err, result) {
    if (err) {
      return next(err);
    }
    res.json({ message: 'Todo item updated successfully' });
  });
});


router.delete('/:id', function(req, res, next) {
  const { id } = req.params;

  connection.query('DELETE FROM todo_items WHERE id = ?', [id], function(err, result) {
    if (err) {
      return next(err);
    }
    res.json({ message: 'Todo item deleted successfully' });
  });
});

module.exports = router;
