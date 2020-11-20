const HTTP = require('http');
const FRONT_SERVER = HTTP.createServer();
const SOCKET = require('socket.io');
const FRONT_IO = SOCKET(FRONT_SERVER);
const SERVER_PORT = 19301;
const PORT_HANDLER = require('get-port');

//Microsoft SQL Server
const SQL = require('mssql');
const DB_CONFIG = {
    server: 'sql5097.site4now.net',
    database: 'DB_A56FAD_playlist',
    user: 'DB_A56FAD_playlist_admin',
    password: 'P2413567cu221',
    port: 1433,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

module.exports = {
    HTTP,
    SQL,
    FRONT_SERVER,
    SOCKET,
    FRONT_IO,
    PORT_HANDLER,
    SERVER_PORT,
    DB_CONFIG
}