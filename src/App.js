import React, { Component } from 'react';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faChevronLeft, faChevronRight, faPause } from '@fortawesome/free-solid-svg-icons';
import './app.css';
import Player from './player';
import { Tracks, Track } from './tracks';
library.add(faPlay, faPause, faChevronLeft, faChevronRight);

class App extends Component {
  root;

  componentDidMount() {
    this.root.addEventListener('dragover', this._stop);
    this.root.addEventListener('dragleave', this._stop);
    this.root.addEventListener('drop', this._drop);
  }

  render() {
    const { tracks, track } = this.props;
    return (
      <div className="app" ref={app => (this.root = app)}>
        <Player
          onEnded={this.nextTrack}
          onPrevTrack={this.prevTrack}
          onNextTrack={this.nextTrack}
          src={track.hasOwnProperty('index') ? tracks[track.index].src : ''}
        />
        <Tracks count={tracks.length}>
          {tracks.map(({ name }, index) => (
            <Track
              key={index}
              onClick={this.selectTrack.bind(this, index)}
              name={name}
              selected={track.index === index}
            />
          ))}
        </Tracks>
      </div>
    );
  }

  componentWillUnmount() {
    this.root.removeEventListener('dragover', this._stop);
    this.root.removeEventListener('dragleave', this._stop);
    this.root.removeEventListener('drop', this._drop);
    this.props.tracks.forEach(track => window.URL.revokeObjectURL(track.src));
  }

  _stop = event => {
    event.preventDefault();
    return false;
  };

  _drop = event => {
    event.preventDefault();
    const items = event.dataTransfer.items;
    if (!items.length || !items[0].webkitGetAsEntry) {
      console.console.warn('Opps!!! :) No hacking!');
      return false;
    }

    const entries = Array.prototype.slice.call(items).map(item => item.webkitGetAsEntry());
    let scanFiles = entries => {
      if (!entries) return;
      entries.forEach(entry => {
        if (entry.isDirectory) {
          let directoryReader = entry.createReader();
          directoryReader.readEntries(entries => scanFiles(entries));
        } else if (entry.isFile) {
          entry.file(file => {
            const name = file.name.replace(/(\.[^.]\w+)*$/, '');
            const src = window.URL.createObjectURL(file);
            if (file.type.indexOf('audio/') + 1)
              this.props.addTrack({
                fileName: file.name,
                name,
                src,
                fileTypeMIME: file.type,
                size: file.size,
              });
          });
        }
      });
    };
    scanFiles(entries);
  };

  addTrack = () => {
    this.props.addTrack();
  };

  selectTrack = index => {
    this.props.selectTrack(index);
  };

  prevTrack = () => {
    const len = this.props.tracks.length;
    if (len) this.props.prevTrack(len - 1);
  };

  nextTrack = () => {
    const len = this.props.tracks.length;
    if (len) this.props.nextTrack(len - 1);
  };
}

export default connect(
  state => ({
    tracks: state.tracks,
    track: state.track,
  }),
  dispatch => ({
    addTrack(payload) {
      dispatch({ type: 'ADD_TRACK', payload });
    },
    selectTrack(index) {
      dispatch({ type: 'SELECT_TRACK', payload: { index } });
    },
    nextTrack(max) {
      dispatch({ type: 'NEXT_TRACK', payload: { max } });
    },
    prevTrack(max) {
      dispatch({ type: 'PREV_TRACK', payload: { max } });
    },
  })
)(App);
