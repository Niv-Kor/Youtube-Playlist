import io from 'socket.io-client';

const serverDomain = 'http://localhost';
const serverPort = 19301;
var socket;

function connect() {
    socket = io(`${serverDomain}:${serverPort}`, {
        transports: ['websocket'],
    });

    socket.once('connection', port => {
        console.log('connected ' + port);
        socket = io(`${serverDomain}:${port}`, {
            transports: ['websocket'],
        });
    });
}

function addVideo(url) {
    socket.emit('add-video', { url });
    console.log('client side');
}

function fetchPlaylist() {
    return new Promise((resolve, reject) => {
        socket.emit('get-playlist');
        socket.once('get-playlist', list => {
            console.log('got playlist', list);
            resolve(list);
        });

        setTimeout(reject, 5000);
    })
}

export {
    connect,
    addVideo,
    fetchPlaylist
};