import io from 'socket.io-client';

const serverDomain = 'http://localhost';
const endpoint = 19301;
const defaultTimeout = 5000;
const playlistReloadCooldown = 1500;
var reloadCooldown = false;
var establishSocket, socket;

function connectServer(onPlaylistReload) {
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

            //server tells this client to reload his playlist
            socket.on('playlist-hard-reload', newList => {
                if (onPlaylistReload && !reloadCooldown) {
                    onPlaylistReload(newList);
                    reloadCooldown = true;

                    //set cooldown to prevent recursive calls
                    setTimeout(() => reloadCooldown = false, playlistReloadCooldown)
                }
            })

            resolve();
        });
    
        establishSocket.on('disconnect', () => {
            establishSocket.removeAllListeners();
        });

        setTimeout(reject, defaultTimeout);
    })
}

function retrievePlaylist() {
    return new Promise((resolve, reject) => {
        try {
            socket.emit('get-playlist');
            socket.once('get-playlist', list => resolve(list));
            setTimeout(reject, defaultTimeout);
        }
        catch (ex) { reject(ex); }
    });
}

function addVideo(url) {
    return new Promise((resolve, reject) => {
        try {
            socket.emit('add-video', { url });
            socket.once('add-video', newList => resolve(newList));
            setTimeout(reject, defaultTimeout);
        }
        catch (ex) { reject(); }
    });
}

function removeVideo(url) {
    return new Promise((resolve, reject) => {
        try {
            socket.emit('remove-video', { url });
            socket.once('remove-video', newList => resolve(newList));
            setTimeout(reject, defaultTimeout);
        }
        catch (ex) { reject(); }
    });
}

function changeOrder(oldIndex, newIndex) {
    return new Promise((resolve, reject) => {
        try {
            socket.emit('change-order', { oldIndex, newIndex });
            socket.once('change-order', newList => resolve(newList));
            setTimeout(reject, defaultTimeout);
        }
        catch (ex) { reject(ex); }
    });
}

export {
    connectServer,
    addVideo,
    removeVideo,
    retrievePlaylist,
    changeOrder
};