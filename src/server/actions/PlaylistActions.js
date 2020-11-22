const CONSTANTS = require('../Constants');
const LOGGER = require('../Logger');
const GENERAL_ACTIONS = require('./GeneralActions');
const apiKey = 'AIzaSyCu8orLsG3kqisODaqocgXXc7lDGkVV0SU';

/**
 * Get the entire playlist from the DB.
 * 
 * @returns {Array} [
 *                     {
 *                        {Number} order - The order if the video within the playlist (where 0 being the first),
 *                        {String} url - The video's source URL code,
 *                        {String} title - The title of the video,
 *                        {String} duration - The duration stamp of the video [mm:ss]
 *                     }
 *                     ...
 *                  ]
 */
function getPlaylist() {
    return new Promise(resolve => {
        GENERAL_ACTIONS.runProcedure('GetPlaylist')
            .then(res => resolve(modifyPlaylistDurations(res[0])))
            .catch(err => {
                LOGGER.error('Could not retrieve the playlist', err);
                resolve(null);
            });
    });
}

function modifyPlaylistDurations(playlist) {
    for (let item of playlist)
        item.duration = secondsToString(item.duration);

    return playlist
}

/**
 * Convert an amount of seconds to a duration string (mm:ss).
 * 
 * @param {Number} seconds - The amount of seconds to Convert
 * @returns {String} A string representation of the seconds (mm:ss).
 */
function secondsToString(seconds) {
    let mins = parseInt(seconds / 60);
    let hours = parseInt(mins / 60);
    let secs = seconds - mins * 60 - hours * 360;
    let hoursPrefix = (hours < 10) ? '0' : '';
    let minsPrefix = (mins < 10) ? '0' : '';
    let secsPrefix = (secs < 10) ? '0' : '';
    let hoursSection = (hours !== 0) ? hoursPrefix + hours + ':' : '';

    return `${hoursSection}${minsPrefix}${mins}:${secsPrefix}${secs}`;
}

/**
 * Remove a video from the playlist.
 * 
 * @param {String} url - The video's source URL
 * @returns {Object} The new modified playlist.
 */
function addVideo(url) {
    return new Promise(resolve => {
        let title = '';
        let duration = 0;
        let fields = 'items(snippet(title),contentDetails(duration))';
        let part = 'snippet,contentDetails';

        CONSTANTS.AXIOS({
            method: 'get',
            url: `https://www.googleapis.com/youtube/v3/videos?id=${url}&key=${apiKey}&fields=${fields}&part=${part}`
        }).then(res => {
            let item = res.data.items[0];
            let durationStr = item.contentDetails.duration;

            //convert duration from the format 'PTmmMssS' to amount of seconds
            let timeStartIndex = durationStr.indexOf('T');

            let hour = 0;
            if (durationStr.indexOf('H') !== -1) {
                let startHour = timeStartIndex + 1;
                timeStartIndex = durationStr.indexOf('H');
                hour = durationStr.substring(startHour, timeStartIndex);
            }

            let min = 0;
            if (durationStr.indexOf('M') !== -1) {
                let startMin = timeStartIndex + 1;
                timeStartIndex = durationStr.indexOf('M');
                min = durationStr.substring(startMin, timeStartIndex);
            }

            let sec = 0;
            if (durationStr.indexOf('S') !== -1) {
                let startSec = timeStartIndex + 1;
                timeStartIndex = durationStr.indexOf('S');
                sec = durationStr.substring(startSec, timeStartIndex);
            }

            //assign procedure parameteres
            duration = parseInt(hour) * 360 + parseInt(min) * 60 + parseInt(sec);
            title = item.snippet.title;

            let params = [
                { name: 'src', type: CONSTANTS.SQL.VarChar(512), value: url, options: {} },
                { name: 'title', type: CONSTANTS.SQL.VarChar(128), value: title, options: {} },
                { name: 'duration', type: CONSTANTS.SQL.Int, value: duration, options: {} },
            ];
        
            GENERAL_ACTIONS.runProcedure('AddVideo', params)
                .then(newPlaylist => resolve(modifyPlaylistDurations(newPlaylist[0])))
                .catch(() => resolve(null));
        });
    });
}

/**
 * Remove a video from the playlist.
 * 
 * @param {String} url - The video's source URL
 * @returns {Object} The new modified playlist.
 */
function removeVideo(url) {
    let params = [
        { name: 'src', type: CONSTANTS.SQL.VarChar(512), value: url, options: {} }
    ];

    return new Promise(resolve => {
        GENERAL_ACTIONS.runProcedure('RemoveVideo', params)
            .then(newPlaylist => resolve(modifyPlaylistDurations(newPlaylist[1])))
            .catch(() => resolve(null));
    });
}

/**
 * Change the order of two videos in the playlist.
 * 
 * @param {Number} oldIndex - The old index of a video in the playlist
 * @param {Number} newIndex - The new index of that same video
 * @returns {Object} The new modified playlist.
 */
function changeOrder(oldIndex, newIndex) {
    let params = [
        { name: 'old_index', type: CONSTANTS.SQL.Int, value: oldIndex, options: {} },
        { name: 'new_index', type: CONSTANTS.SQL.Int, value: newIndex, options: {} },
    ];

    return new Promise(resolve => {
        GENERAL_ACTIONS.runProcedure('ChangeOrder', params)
            .then(newPlaylist => resolve(modifyPlaylistDurations(newPlaylist[0])))
            .catch(() => resolve(null));
    });
}

module.exports = {
    getPlaylist,
    addVideo,
    removeVideo,
    changeOrder
};