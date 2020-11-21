import React from 'react';
import Player from './Player';
import YoutubeLogo from '../youtube_logo.png';

function GetPlayerMask(props) {
    if (!props.playlist || !props.playlist.length) {
        return (
            <div className="player-mask">
                <p
                    id="no-videos-message"
                    align="center"
                    justify="center"
                >
                    Start by adding videos to your playlist!
                </p>
                <img
                    id="youtube-logo"
                    src={YoutubeLogo}
                    alt=''
                />
            </div>
        )
    }
    else return (
        <div></div>
    )
}

function PlayerSection(props) {
    return (
        <div className="player-div">
            <Player playlist={props.playlist} />
            <GetPlayerMask playlist={props.playlist} />
        </div>
    )
}

export default PlayerSection;