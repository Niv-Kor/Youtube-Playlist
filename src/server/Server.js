const CONSTANTS = require('./Constants');
const LOGGER = require('./Logger');
const ACTIONS = {
    general: require('./actions/GeneralActions'),
    playlist: require('./actions/PlaylistActions')
}

const clients = [];
CONSTANTS.FRONT_IO.setMaxListeners(0);

//handle client's connection
CONSTANTS.FRONT_IO.on('connection', async socket => {
    //assign a socket for a client
    let port = await CONSTANTS.PORT_HANDLER();
    let personalServer = CONSTANTS.HTTP.createServer();
    let personalIO = CONSTANTS.FRONT_IO.listen(personalServer);
    clients.push(personalIO);
    personalServer.listen(port, err => {
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
        socket.on('get-playlist', async () => {
            let list = await ACTIONS.playlist.getPlaylist();
            socket.emit('get-playlist', list);
        });

        socket.on('add-video', async data => {
            let newList = await ACTIONS.playlist.addVideo(data.url);
            socket.emit('add-video', newList);
        });

        socket.on('remove-video', async data => {
            let newList = await ACTIONS.playlist.removeVideo(data.url);
            socket.emit('remove-video', newList);

            //emit the new list to all other clients
            if (newList)
                for (let otherClient of clients)
                    if (otherClient !== socket)
                        otherClient.emit('playlist-hard-reload', newList);
        });

        socket.on('change-order', async data => {
            let newList = await ACTIONS.playlist.changeOrder(data.oldIndex, data.newIndex);
            socket.emit('change-order', newList);
        });

        personalServer.removeListener('exit', () => {
            LOGGER.log('removed');
        })
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