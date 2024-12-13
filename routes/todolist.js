var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'COMP206',
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
  connection.query('SELECT * FROM todo_items WHERE deleted_ts IS NULL', function(err, results) {
    if (err) {
      return next(err);
    }
    res.json(results); 
  });
});


router.post('/', function(req, res, next) {
  const { description } = req.body;
  const created_ts = new Date();

  connection.query('INSERT INTO todo_items (description, created_ts) VALUES (?, ?)', [description, created_ts], function(err, result) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      message: 'Todo item added successfully',
      id: result.insertId,
      description: description,
      created_ts: created_ts
    });
  });
});


router.put('/:id', function(req, res, next) {
  const { id } = req.params;
  const { description, is_completed } = req.body;
  const updated_ts = new Date();

  connection.query('UPDATE todo_items SET description = ?, is_completed = ?, updated_ts = ? WHERE id = ?', [description, is_completed, updated_ts, id], function(err, result) {
    if (err) {
      return next(err);
    }
    res.json({
      message: 'Todo item updated successfully',
      id: id,
      description: description,
      is_completed: is_completed,
      updated_ts: updated_ts
    });
  });
});

router.delete('/:id', function(req, res, next) {
  const { id } = req.params;
  const deleted_ts = new Date();

  connection.query('UPDATE todo_items SET deleted_ts = ? WHERE id = ?', [deleted_ts, id], function(err, result) {
    if (err) {
      return next(err);
    }
    res.status(204).end();  
  });
});

router.post('/:id/restore', function(req, res, next) {
  const { id } = req.params;

  connection.query('UPDATE todo_items SET deleted_ts = NULL WHERE id = ?', [id], function(err, result) {
    if (err) {
      return next(err);
    }
    res.json({
      message: 'Todo item restored successfully',
      id: id
    });
  });
});


router.get('/deleted', function(req, res, next) {
  connection.query('SELECT * FROM todo_items WHERE deleted_ts IS NOT NULL', function(err, results) {
    if (err) {
      return next(err);
    }
    res.json(results); 
  });
});

module.exports = router;
