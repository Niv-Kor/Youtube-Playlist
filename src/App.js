import './App.css';
import React from 'react';
import Wallpaper from './wallpaper.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { connectServerAction, retrievePlaylistAction } from './store/actions/index';
import PlaylistSection from './components/PlaylistSection.js';
import PlayerSection from './components/PlayerSection.js';

var connected = false;

function App() {
  const playlist = useSelector(state => state.Playlist);
  const dispatch = useDispatch();

  //prevent DB connection from occuring with each component update
  if (!connected) {
    dispatch(connectServerAction()).then(() => dispatch(retrievePlaylistAction()));
    connected = true;
  }

  return (
      <div className="app">
        <img className="wallpaper" src={Wallpaper} alt=''/>
        <PlayerSection playlist={playlist} />
        <PlaylistSection playlist={playlist} />
      </div>
  )
}

export default App;