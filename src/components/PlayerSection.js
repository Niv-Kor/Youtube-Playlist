import React from 'react';
import Player from './Player';

function PlayerSection(props) {
    return (
        <div className="player-div">
            <Player playlist={props.playlist} />
        </div>
    )
}

export default PlayerSection;