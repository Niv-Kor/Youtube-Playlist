import React, {Component} from 'react';
import Player from './Player';

class PlayerSection extends Component {
    render() {
        return (
            <div className="player-div">
                <Player />
            </div>
        )
    }
}

export default PlayerSection;