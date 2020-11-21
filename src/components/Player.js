import React from 'react';
import { connect } from 'react-redux';
import { retrievePlaylistAction } from '../store/actions/index';

function mapStateToProps(state) {
    return {
        playlist: state.Playlist
    };
}

const mapDispatchToProps = dispatch => ({
    fetchPlaylist: () => dispatch(retrievePlaylistAction())
});

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player: null,
            done: false,
            YT: null,
            reframed: false,
            videoId: ''
        }

        this.init();
        window['onYouTubeIframeAPIReady'] = async () => {
            let firstUrl = await this.getFirstVideoUrl();
            this.loadVideo = this.loadVideo.bind(this);

            this.state.YT = window['YT'];
            this.state.reframed = false;
            this.state.player = new this.state.YT.Player('player', {
                videoId: firstUrl,
                events: {
                    'onStateChange': this.onPlayerStateChange.bind(this),
                    'onError': err => console.error('Player error:', err),
                    'onReady': e => {
                        this.setState({ videoId: firstUrl });
                        this.loadVideo();
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
    async getFirstVideoUrl() {
        await this.props.fetchPlaylist();

        let playlist = this.props.playlist.playlist;
        if (!playlist || !playlist.length) return '';
        else return playlist[0].url;
    }

    /**
     * Load the first video in the playlist.
     */
    loadVideo() {
        this.state.player.loadVideoById({
            'videoId': this.state.videoId,
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

export default connect(mapStateToProps, mapDispatchToProps)(Player);