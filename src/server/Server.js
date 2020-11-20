const CONSTANTS = require('./Constants');
const LOGGER = require('./Logger');
const ACTIONS = {
    general: require('./actions/GeneralActions'),
    playlist: require('./actions/PlaylistActions')
}

//handle client's connection
CONSTANTS.FRONT_IO.on('connection', async socket => {
    //assign a socket for a client
    let port = await CONSTANTS.PORT_HANDLER();
    let personalServer = CONSTANTS.HTTP.createServer();
    let personalIO = CONSTANTS.SOCKET.listen(personalServer);
    personalServer.listen(port, function(err) {
        if (err) LOGGER.error(`port ${port} could not be connected`, err);
        else {
            let origin = socket.handshake.headers.origin;
            LOGGER.log(`${origin} has connected to port ${port}.`);
        }
    });

    //send the allocated port to the client
    socket.emit('connection', port);

    //handle client's requests to the server
    personalIO.on('connection', socket => {
        socket.on('add_video', async data => {
            let res = await ACTIONS.playlist.addVideo(data);
            socket.emit('add_video', res);
        });

        socket.on('remove_video', async data => {
            let res = await ACTIONS.playlist.removeVideo(data);
            socket.emit('remove_video', res);
        });
    });
});

CONSTANTS.FRONT_SERVER.listen(CONSTANTS.SERVER_PORT, function(error) {
    //connect to data base
    CONSTANTS.SQL.connect(CONSTANTS.DB_CONFIG)
        .then(() => {
            LOGGER.log('Microsoft SQL Server DB is properly connected.');
            if (error) LOGGER.error('Server startup failed.', err);
            else LOGGER.log('Server is listening to port ' + CONSTANTS.SERVER_PORT + '.');
        })
        .catch(err => LOGGER.error('Microsoft SQL Server DB has encountered a problem.', err));
})