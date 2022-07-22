const http = require('http');

const server = http.createServer((req, res) => {

});


server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});