const http = require('http');
const mysql = require('mysql');

let configToMySQL = {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'project3',
    charset: 'utf8mb4'
}

const connection = mysql.createConnection(configToMySQL);
connection.connect((err) => {
    if(err){
        console.log(err);
    } else {
        console.log('Connect Sucess');
    }
});


const server = http.createServer((req, res) => {

});


server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});