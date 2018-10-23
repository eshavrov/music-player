import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Player extends React.Component {
  state = {
    // file: 'https://www.mfiles.co.uk/mp3-downloads/edvard-grieg-peer-gynt1-morning-mood-piano.mp3',
    playing: false,
    progress: 0,
    inSetProgressMode: false,
  };

  isProgressDirty = false;
  intervalId;
  player;
  progressBar;

  componentDidMount() {
    this.intervalId = setInterval(this.onUpdate, 1000);
  }

  render() {
    const player = this.player;
    const fileName = this.props.src || '';
    if (player && fileName !== '') {
      if (player.src !== fileName) {
        player.src = fileName;
      }
      if (player.paused) {
        if (player.currentTime === player.duration) {
          if (this.props.onEnded) this.props.onEnded();
        } else if (this.state.playing) player.play();
      } else if (!this.state.playing) {
        player.pause();
      }
      if (this.isProgressDirty) {
        this.isProgressDirty = false;

        player.currentTime =
          player.duration && this.state.progress ? player.duration * this.state.progress : 0;
      }
    }

    return (
      <div className="player">
        <div className="controls">
          <span onClick={this.props.onPrevTrack}>
            <FontAwesomeIcon icon="chevron-left" />
          </span>
          <span onClick={this.togglePlay}>
            <FontAwesomeIcon icon={this.state.playing ? 'pause' : 'play'} />
          </span>
          <span onClick={this.props.onNextTrack}>
            <FontAwesomeIcon icon="chevron-right" />
          </span>
        </div>
        <div
          className="progress"
          ref={bar => (this.progressBar = bar)}
          onMouseDown={this.startSetProgress}
          onMouseMove={this.setProgress}
          onMouseLeave={this.stopSetProgress}
          onMouseUp={this.stopSetProgress}
        >
          <div className="bar">
            <div
              style={{ width: `${Math.max(1.7, 100 * this.state.progress)}%` }}
              className={this.state.inSetProgressMode ? 'active' : ''}
            />
          </div>
        </div>
        <div className="time">
          {formatMMSS(player && player.currentTime ? player.currentTime : 0)} /
          {formatMMSS(player && player.duration ? player.duration : 0)}
        </div>
        <audio ref={audio => (this.player = audio)} autoPlay={this.state.playing} />
      </div>
    );
  }

  onUpdate = () => {
    if (this.player && !this.isProgressDirty) {
      this.setState({ progress: this.player.currentTime / this.player.duration });
    }
  };

  togglePlay = () => {
    this.setState({
      playing: !this.state.playing,
    });
  };

  setProgress = (event, perform) => {
    if (perform || this.state.inSetProgressMode) {
      const progress =
        (event.clientX - offsetLeft(this.progressBar) - 6) / (this.progressBar.offsetWidth - 12);
      this.isProgressDirty = true;
      this.setState({ progress: Math.max(0, Math.min(0.99, progress)) });
    }
  };

  startSetProgress = event => {
    this.setState({ inSetProgressMode: true });
    this.setProgress(event, true);
  };

  stopSetProgress = event => {
    this.setState({
      inSetProgressMode: false,
    });
    this.setProgress(event);
  };
}

function formatMMSS(time) {
  const sec = Math.floor(time % 60);
  return Math.floor(time / 60) + ':' + (sec < 10 ? '0' + sec : sec);
}

function offsetLeft(element) {
  let left = 0;
  while (element && element !== document) {
    left += element.offsetLeft;
    element = element.offsetParent;
  }
  return left;
}
