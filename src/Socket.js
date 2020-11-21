import io from 'socket.io-client';

const serverDomain = 'http://localhost';
const endpoint = 19301;
const defaultTimeout = 5000;
var establishSocket, socket;

function connectServer() {
    return new Promise((resolve, reject) => {
        establishSocket = io(`${serverDomain}:${endpoint}`, {
            transports: ['websocket'],
        });
    
        establishSocket.once('connection', async port => {
            console.log('connected ' + port);
            establishSocket.removeAllListeners();
            establishSocket.disconnect();
            socket = io(`${serverDomain}:${port}`, {
                transports: ['websocket'],
            });

            resolve();
        });
    
        establishSocket.on('disconnect', () => {
            establishSocket.removeAllListeners();
        });

        setTimeout(reject, defaultTimeout);
    })
}

function addVideo(url) {
    return new Promise((resolve, reject) => {
        socket.emit('add-video', { url });
        socket.once('add-video', () => resolve);
        setTimeout(reject, defaultTimeout);
    });
}

function retrievePlaylist() {
    return new Promise((resolve, reject) => {
        socket.emit('get-playlist');
        socket.once('get-playlist', list => resolve(list));
        setTimeout(reject, defaultTimeout);
    });
}

export {
    connectServer,
    addVideo,
    retrievePlaylist
};