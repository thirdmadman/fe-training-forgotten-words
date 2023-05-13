export class MusicPlayer {
  private isPlaying = false;

  private isPaused = false;

  private currentVolume = 1;

  private currentPlaylist = Array<string>();

  private currentTrack = -1;

  private audio = new Audio();

  private isLooping = false;

  getCurrentPlayingTrack() {
    if (this.isPlaying && !this.isPaused) {
      return this.currentPlaylist[this.currentTrack];
    }
    return null;
  }

  getIsPaused() {
    return this.isPaused;
  }

  addToPlaylist(srcArray: Array<string>) {
    this.currentPlaylist = this.currentPlaylist.concat(srcArray);
  }

  setPlayList(srcArray: Array<string>, isLooping = false) {
    this.isLooping = isLooping;
    this.stop();
    this.currentPlaylist = srcArray;
    this.currentTrack = -1;
  }

  scrollTrackTo(porc: number) {
    if (this.audio) {
      this.audio.play().then(
        () => {
          this.audio.currentTime = (this.audio.duration / 100) * porc;
        },
        (e) => {
          console.error(e);
        },
      );
    }
  }

  play() {
    if (this.currentPlaylist.length <= 0) {
      return new Promise(() => {});
    }

    if (this.currentTrack === -1) {
      this.currentTrack = 0;
    }
    if (!this.isPlaying && !this.isPaused) {
      this.audio.src = this.currentPlaylist[this.currentTrack];
      this.audio.volume = this.currentVolume;

      this.audio.onended = () => {
        if (this.currentTrack < this.currentPlaylist.length - 1) {
          this.stop();
          return this.next();
        }

        if (this.isLooping) {
          this.stop();
          return this.next();
        }
        return null;
      };

      this.isPlaying = true;
      this.isPaused = false;
      return this.audio.play().catch((e) => {
        console.error(e);
        this.isPlaying = false;
      });
    }

    if (this.isPaused) {
      this.isPlaying = true;
      this.isPaused = false;
      return this.audio.play().then(() => this.riseVolume(this.currentVolume, 0.001, 5)).catch((e) => {
        console.error(e);
        this.isPlaying = false;
      });
    }

    return new Promise(() => {});
  }

  setVolume(value: number) {
    this.currentVolume = value;
    this.audio.volume = value;
  }

  getIsPlayingState() {
    return this.isPlaying;
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPaused = false;
    this.isPlaying = false;
  }

  pause() {
    if (this.audio) {
      this.fadeVolume(0, 0.001, 5).then(() => {
        this.audio.pause();
        this.isPlaying = false;
        this.isPaused = true;
      }).catch((e) => console.error(e));
    }
  }

  prev() {
    this.stop();
    if (this.currentTrack > 0) {
      this.currentTrack += 1;
    } else {
      this.currentTrack = this.currentPlaylist.length - 1;
    }
    return this.play();
  }

  next() {
    this.stop();
    if (this.currentTrack < this.currentPlaylist.length - 1) {
      this.currentTrack += 1;
    } else {
      this.currentTrack = 0;
    }
    return this.play();
  }

  fadeVolume(fadeToVolume: number, factor: number, speed: number) {
    return new Promise((resolve) => {
      const refreshId = window.setInterval(() => {
        if (this.audio.volume - factor >= fadeToVolume) {
          this.audio.volume -= factor;
        } else {
          clearInterval(refreshId);
          resolve(0);
        }
      }, speed);
    });
  }

  riseVolume(riseToVolume: number, factor: number, speed: number) {
    return new Promise((resolve) => {
      const refreshId = window.setInterval(() => {
        if (this.audio.volume + factor <= riseToVolume) {
          this.audio.volume += factor;
        } else {
          clearInterval(refreshId);
          resolve(0);
        }
      }, speed);
    });
  }
}
