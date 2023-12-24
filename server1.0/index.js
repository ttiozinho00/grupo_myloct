// index.js
const express = require('express');
const http = require('http');
const routes = require('./routes');
const authMiddleware = require('./middlewares/auth');

require('dotenv').config();

const app = express();
require('./config/express')(app);
require('./config/database');

app.use(authMiddleware());
app.use(routes);

const PORT = process.env.PORT || 3000; // Use 3000 as the default port if PORT is not defined

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}...`);
});
