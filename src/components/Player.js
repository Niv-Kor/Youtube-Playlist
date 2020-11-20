import React from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
        playlist: state.Playlist
    };
}

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player: null,
            done: false,
            YT: null,
            reframed: false,
            videoId: '1cH2cerUpMQ'
        }

        this.init();
        window['onYouTubeIframeAPIReady'] = () => {
            this.state.YT = window['YT'];
            this.state.reframed = false;
            this.state.player = new this.state.YT.Player('player', {
                videoId: this.state.videoId,
                events: {
                    'onStateChange': this.onPlayerStateChange.bind(this),
                    'onError': this.onPlayerError.bind(this),
                    'onReady': (e) => {
                        e.target.playVideo();
                    }
                }
            });
        }
    }

    init() {
        var tag = document.createElement('script');
        tag.src = 'http://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    onPlayerReady(event) {
        event.target.playVideo();
    }

    onPlayerStateChange(event) {
        switch (event.data) {
            case this.state.YT.PlayerState.PLAYING:
                if (this.cleanTime() === 0) {
                    console.log('started ' + this.cleanTime());
                }
                else {
                    console.log('playing ' + this.cleanTime())
                };
                break;

            case this.state.YT.PlayerState.PAUSED:
                if (this.state.player.getDuration() - this.state.player.getCurrentTime() !== 0) {
                    console.log('paused @' + this.cleanTime());
                };
                break;

            case this.state.YT.PlayerState.ENDED:
                console.log('ended');
                break;

            default: return;
        };
    };

    cleanTime() {
        return Math.round(this.state.player.getCurrentTime())
    };

    onPlayerError(err) {
        console.error('Player error', err);
    }

    stopVideo() {
        this.state.player.stopVideo();
    }

    loadVideo(url) {
        this.state.player.loadVideoById({
            'videoId': url,
            'startSeconds': 0
        });
    }

    render() {
        return (
            <div id="player">
            </div>
        )
    }
}

export default connect(mapStateToProps)(Player);