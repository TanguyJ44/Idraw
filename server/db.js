import mysql from 'mysql';

// Create a connection to the database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'idraw'
});

// Connect to the database
connection.connect(function(err) {
  if (err) throw err;
  console.log('Mysql Connected !');
});

// Export the connection
export const dbConnection = connection;