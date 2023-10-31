const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
// const parser = require('body-parser')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}));
const port = 3000

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'drone_delivery',
    port: 3306
});
connection.connect();
var data;
console.log(data);
app.get('/viewall', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  connection.query('SELECT * from products', (err, rows, fields) => {
    if (err) throw err
    data = rows;
    // console.log('The solution is: ', rows)
  }); res.send(data);
});
app.get('/search', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  var id = req.query.id;
  console.log(id);
  console.log("api fired");
  console.log(req.query.id);
  !isNaN(id) && id.length != 0 ? connection.query('SELECT * from products where pid = '+parseInt(id), (err, rows, fields) => {
    if (err) throw err
    data = rows;
    // console.log('The solution is: ', rows)
  }) : id.length == 0 ? connection.query('SELECT * from products', (err, rows, fields) => {
    if (err) throw err
        data = rows;
    // console.log('The solution is: ', rows)
}) : connection.query("SELECT * from products where p_desc like '%"+id+"%'", (err, rows, fields) => {
    if (err) throw err
    data = rows;
    // console.log('The solution is: ', rows)
  });
  res.send(data);
});
app.post('/update', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  console.log("Called");
  console.log(req.body);
  var id = req.body.pid;
  var weight = req.body.weight;
  var p_cost = req.body.p_cost;
  var p_desc = req.body.p_desc;
  var stock = req.body.p_stock;
  var oid = req.body.oid;
  console.log(id, weight, p_cost, p_desc, stock, oid);
  connection.query(`Update products set weight = '${weight}', p_cost = '${p_cost}', p_desc = '${p_desc}', p_stock = '${stock}', oid = '${oid}' where pid = ${parseInt(id)}`, (err, result) => {
    if (!err) {
      res.status(200).json({ status: "Update successful" }); // Send a JSON response.
      console.log(result.affectedRows);
      console.log("Updated");
    } else {
      res.status(400).json({ status: "Update failed" }); // Send a JSON response.
      console.log(err);
    }
  });
});
app.post('/delete', (req, res) => {
  var pid = req.body.pid;
  connection.query(`Delete from products where pid = ${pid}`, (err, result) => {
    if (!err) {
      res.status(200).json({ status: "Deleted successful" }); // Send a JSON response.
      console.log(result.affectedRows);
      console.log("Deleted");
    } else {
      res.status(400).json({ status: "Deletion failed" }); // Send a JSON response.
      console.log(err);
    }
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
app.post('/add', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  console.log("Called");
  console.log(req.body);
  var id = req.body.pid;
  var weight = req.body.weight;
  var p_cost = req.body.p_cost;
  var p_desc = req.body.p_desc;
  var stock = req.body.p_stock;
  var oid = req.body.oid;
  console.log(`Insert into products values ( ${parseInt(id)}, '${weight}', p_cost = '${p_cost}', p_desc = '${p_desc}', p_stock = '${stock}', oid = '${oid}')`);
  connection.query(`Insert into products values ( ${parseInt(id)}, '${weight}', '${p_cost}', '${p_desc}', '${stock}', '${oid}')`, (err, result) => {
    if (!err) {
      res.status(200).json({ status: "Inserted successful" }); // Send a JSON response.
      console.log(result.affectedRows);
      console.log("Inserted");
    } else {
      res.status(400).json({ status: "Insertion failed" }); // Send a JSON response.
      console.log(err);
    }
  });
});
// connection.end();