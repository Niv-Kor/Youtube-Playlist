const CONSTANTS = require('../Constants');
const LOGGER = require('../Logger');
const GENERAL_ACTIONS = require('./GeneralActions');

module.exports = {
    getPlaylist,
    addVideo,
    removeVideo
};

/**
 * Get the entire playlist from the DB.
 */
function getPlaylist() {
    return new Promise(resolve => {
        GENERAL_ACTIONS.runProcedure('GetPlaylist', params)
        .then(res => resolve(res))
        .catch(err => {
            LOGGER.error('Could not retrieve the playlist', err);
            resolve(null);
        });
    });
}

/**
 * Convert an amount of seconds to a duration string (mm:ss).
 * 
 * @param {Number} seconds - The amount of seconds to Convert
 * @returns {String} A string representation of the seconds (mm:ss).
 */
function secondsToString(seconds) {
    let mins = parseInt(seconds / 60);
    let secs = seconds - mins * 60;
    return `${mins}:${secs}`;
}

/**
 * Remove a video from the playlist.
 * 
 * @param {String} url - The video's source URL
 * @param {String} title - The video's title
 * @param {Number} duration - The video's duration in seconds
 * @returns {Boolean} True if the video has been deleted successfully.
 */
function addVideo(url, title, duration) {
    let params = [
        { name: 'src', type: CONSTANTS.SQL.VarChar(512), value: url, options: {} },
        { name: 'title', type: CONSTANTS.SQL.VarChar(128), value: title, options: {} },
        { name: 'duration', type: CONSTANTS.SQL.Int, value: duration, options: {} },
    ];

    return new Promise(resolve => {
        GENERAL_ACTIONS.runProcedure('AddVideo', params)
        .then(res => resolve(!!res))
        .catch(err => {
            LOGGER.error(`Could not add video #${title}`, err);
            resolve(false);
        });
    });
}

/**
 * Remove a video from the playlist.
 * 
 * @param {String} url - The video's source URL
 * @param {String} title - The video's title
 * @returns {Boolean} True if the video has been deleted successfully.
 */
function removeVideo(url, title) {
    let params = [
        { name: 'src', type: CONSTANTS.SQL.VarChar(512), value: url, options: {} }
    ];

    return new Promise(resolve => {
        GENERAL_ACTIONS.runProcedure('RemoveVideo', params)
        .then(res => resolve(!!res))
        .catch(err => {
            LOGGER.error(`Could not remove video #${title}`, err);
            resolve(false);
        });
    });
}