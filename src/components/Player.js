import React from 'react';
import { connect } from 'react-redux';
import { listReloadedAction } from '../store/actions/index';

const mapDispatchToProps = dispatch => ({
    listReloaded: url => dispatch(listReloadedAction(url))
});

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player: null,
            done: false,
            YT: null,
            videoId: '',
            loaded: false,
            firstLoad: true
        }

        this.init();
        window['onYouTubeIframeAPIReady'] = async () => {
            let firstUrl = this.getFirstVideoUrl();
            this.loadVideo = this.loadVideo.bind(this);

            this.state.YT = window['YT'];
            this.state.player = new this.state.YT.Player('player', {
                videoId: firstUrl,
                events: {
                    'onStateChange': this.onPlayerStateChange.bind(this),
                    'onError': err => console.error('Player error:', err),
                    'onReady': e => {
                        this.setState({ videoId: firstUrl });
                        this.loadVideo();
                        e.target.playVideo();
                        this.setState({ loaded: true });
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

    componentDidUpdate(prevProps) {
        if (this.state.loaded && (prevProps.playlist !== this.props.playlist || this.state.firstLoad)) {
            this.setState({ videoId: this.getFirstVideoUrl() });
            this.setState({ firstLoad: false });
            this.loadVideo();
        }
    }

    onPlayerStateChange(event) {
        switch (event.data) {
            case this.state.YT.PlayerState.PLAYING:
                if (this.getPassedTime() === 0) {
                    console.log('started ' + this.getPassedTime());
                }
                else {
                    console.log('playing ' + this.getPassedTime())
                };
                break;

            case this.state.YT.PlayerState.PAUSED:
                if (this.state.player.getDuration() - this.state.player.getCurrentTime() !== 0) {
                    console.log('paused @' + this.getPassedTime());
                };
                break;

            case this.state.YT.PlayerState.ENDED:
                console.log('ended');
                break;

            default: return;
        };
    };

    /**
     * @returns {Number} The time that has passed since the beginning of the video.
     */
    getPassedTime() {
        return Math.round(this.state.player.getCurrentTime())
    };

    /**
     * Stop the video player.
     */
    stopVideo() {
        this.state.player.stopVideo();
    }

    /**
     * @returns {String} The URL of the first video in the playlist.
     */
    getFirstVideoUrl() {
        let playlist = this.props.playlist;
        if (!playlist || !playlist.length) return '';
        else return playlist[0] ? playlist[0].url : '';
    }

    /**
     * Load the first video in the playlist.
     */
    loadVideo() {
        if (!this.state.loaded || !this.props.playlist || !this.props.playlist.length) return;

        this.state.player.loadVideoById({
            'videoId': this.props.playlist[0].url,
            'startSeconds': 0
        });
    }

    render() {
        return (
            <div id="player"></div>
        )
    }
}

export default connect(null, mapDispatchToProps)(Player);