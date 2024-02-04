const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const con = require('./connection'); // Assuming ./connection exports a MySQL connection

// Static Files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.get('/add', function (req, res) {
  res.sendFile(__dirname + '/add.html');
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/home.html');
});

app.post('/add', function (req, res) {
  var taskName = req.body.taskName;
  var description = req.body.description;

  var sql = "INSERT INTO tache (taskName, description) VALUES ?";
  var values = [[taskName, description]];

  con.query(sql, [values], function (error, result) {
    if (error) throw error;
    res.redirect('/add');
  });
});

app.get('/tache', function (req, res) {
  var sql = "SELECT * FROM tache";
  con.query(sql, function (error, result) {
    if (error) console.log(error);
    res.render(__dirname + "/tache", { tache: result });
  });
});

app.get('/delete-tache', function (req, res) {
  var sql = "DELETE FROM tache WHERE id=?";
  var id = req.query.id;

  con.query(sql, [id], function (error, result) {
    if (error) console.log(error);
    res.redirect('/tache');
  });
});

app.get('/update-tache', function (req, res) {
  var sql = "select * FROM tache WHERE id=?";
  var id = req.query.id;

  con.query(sql, [id], function (error, result) {
    if (error) console.log(error);
    res.render(__dirname + "/update-tache", { tache: result });
  });
});


app.post('/update-tache', function (req, res) {
  var taskName = req.body.taskName;
  var description = req.body.description;
  var id = req.body.id;

  con.connect(function (error) {
    if (error) console.log(error);

    var sql = "UPDATE tache set taskName=?,description=? WHERE id=?";

    con.query(sql, [taskName, description, id], function (error, result) {
      if (error) console.log(error);
      res.redirect('/tache');
    });
  });
});


app.get('/serach-tache', function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);
    var sql = "select * FROM tache ";
    con.query(sql, function (error, result) {
      if (error) console.log(error);
      res.render(__dirname + "/serach-tache", { tache: result });
    });
  });
});



app.get('/serach', function (req, res) {
  var taskName = req.query.taskName;
  var description = req.query.description;

  con.connect(function (error) {
    if (error) console.log(error);

    var sql = "select * FROM tache  where taskName LIKE '%" + taskName + "%' AND description LIKE '%" + description + "%' ";

    con.query(sql, function (error, result) {
      if (error) console.log(error);
      res.render(__dirname + "/serach-tache", { tache: result });
    });
  });
});





app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', function (req, res) {
  var email = req.body.email; // Assuming 'email' is the name attribute in your HTML form for the email input
  var password = req.body.password;

  var sql = "INSERT INTO login (email, password) VALUES (?, ?)"; // Corrected SQL syntax
  var values = [email, password];

  con.query(sql, values, function (error, result) {
    if (error) throw error;
    res.redirect('/add');
  });
  
});


app.listen(port, () => console.log(`Listening on port ${port}`));
