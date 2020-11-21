const { AXIOS } = require('../Constants');
const CONSTANTS = require('../Constants');
const LOGGER = require('../Logger');
const GENERAL_ACTIONS = require('./GeneralActions');
const apiKey = 'AIzaSyCu8orLsG3kqisODaqocgXXc7lDGkVV0SU';

module.exports = {
    getPlaylist,
    addVideo,
    removeVideo
};

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
        .then(res => {
            //convert duration back to a string format [mm:ss]
            for (let item of res)
                item.duration = secondsToString(item.duration);

            resolve(res);
        }).catch(err => {
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
    let minsPrefix = (mins < 10) ? '0' : '';
    let secsPrefix = (secs < 10) ? '0' : '';
    return `${minsPrefix}${mins}:${secsPrefix}${secs}`;
}

/**
 * Remove a video from the playlist.
 * 
 * @param {String} url - The video's source URL
 * @returns {Boolean} True if the video has been deleted successfully.
 */
function addVideo(url) {
    return new Promise(resolve => {
        let title = '';
        let duration = 0;
        let fields = 'items(snippet(title),contentDetails(duration))';
        let part = 'snippet,contentDetails';

        AXIOS({
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
                .then(res => resolve(!!res))
                .catch(() => resolve(false));
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
        .catch(err => resolve(false));
    });
}