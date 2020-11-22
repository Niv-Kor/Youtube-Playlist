import React from 'react';
import Player from './Player';
import { useDispatch } from 'react-redux';
import { focusVideoInputAction } from '../store/actions/index';
import YoutubeLogo from '../res/youtube_logo.png';

function PlayerSection(props) {
    const dispatch = useDispatch();

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
                        onClick={() => dispatch(focusVideoInputAction(true))}
                    />
                </div>
            )
        }
        else return (
            <div></div>
        )
    }

    return (
        <div className="player-div">
            <Player playlist={props.playlist} />
            <GetPlayerMask playlist={props.playlist} />
        </div>
    )
}

export default PlayerSection;