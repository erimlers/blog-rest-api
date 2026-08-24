require('dotenv').config();
require('./src/config/db');
const app = require('./app');
const http = require('http');
const socketConfig = require('./src/socket');

const port = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.io'yu başlat
socketConfig.init(server);

server.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı.`);
});
