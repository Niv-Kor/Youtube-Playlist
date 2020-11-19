import './App.css';
import React, {Component} from 'react';
import PlaylistSection from './components/PlaylistSection.js';
import PlayerSection from './components/PlayerSection.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <PlayerSection />
        <PlaylistSection />
      </div>
    );
  }
}

export default App;