import mysql from 'mysql';

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'idraw'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('Mysql Connected !');
});

export const dbConnection = connection;