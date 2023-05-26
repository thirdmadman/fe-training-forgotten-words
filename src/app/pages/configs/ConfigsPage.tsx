import { useEffect, useState } from 'react';
import { GlobalConstants } from '../../../GlobalConstants';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import { musicPlayer } from '../../services/SingleMusicPlayer';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { WordService } from '../../services/WordService';
import './configsPage.scss';

const { WORDBOOK_MUSIC_NAME, MUSIC_PATH, API_URL } = GlobalConstants;

const WORD_EXAMPLE_ID = '5e9f5ee35eb9e72bc21af5a8';

export function ConfigsPage() {
  const [soundsLevel, setSoundsLevel] = useState(0);
  const [musicLevel, setMusicLevel] = useState(0);

  useEffect(() => {
    const { userConfigs } = DataLocalStorageProvider.getData();
    const soundsLevelConfig = userConfigs.soundsLevel;
    const musicLevelConfig = userConfigs.musicLevel;

    setSoundsLevel(soundsLevelConfig);
    setMusicLevel(musicLevelConfig);
  }, []);

  const saveSettings = () => {
    const configs = { ...DataLocalStorageProvider.getData() };
    configs.userConfigs.soundsLevel = soundsLevel;
    configs.userConfigs.musicLevel = musicLevel;
    DataLocalStorageProvider.setData(configs);
  };

  const soundsLevelHandler = (level: number) => {
    setSoundsLevel(Number(level));
    musicPlayer.setVolume(0.7 * level);
  };
  const musicLevelHandler = (level: number) => {
    setMusicLevel(Number(level));
    musicPlayer2.setVolume(0.09 * level);
  };

  const playWordExample = () => {
    musicPlayer.stop();
    WordService.getWordsById(WORD_EXAMPLE_ID)
      .then((word) => {
        soundsLevelHandler(soundsLevel);
        musicPlayer.setPlayList([`${API_URL}/${word.audio}`]);
        musicPlayer.play().catch(() => {});
      })
      .catch((e) => console.error(e));
  };

  const playMusicExample = () => {
    musicPlayer2.stop();
    musicLevelHandler(musicLevel);
    musicPlayer2.setPlayList([`${MUSIC_PATH + WORDBOOK_MUSIC_NAME}`]);
    musicPlayer2.play().catch(() => {});
  };

  return (
    <div className="configs">
      <div className="configs__title">Configs</div>
      <div className="configs__group">
        <label htmlFor="config_music_level">
          Music level [{musicLevel}]
          <input
            type="range"
            id="config_music_level"
            min={0}
            max={1}
            value={musicLevel}
            step={0.01}
            onChange={(e) => musicLevelHandler(Number(e.target.value))}
          />
        </label>
        <button className="configs__play" aria-label="Play" type="button" onClick={playMusicExample} />
      </div>
      <div className="configs__group">
        <label htmlFor="config_sounds_level">
          Sounds level [{soundsLevel}]
          <input
            type="range"
            id="config_sounds_level"
            min={0}
            max={1}
            value={soundsLevel}
            step={0.01}
            onChange={(e) => soundsLevelHandler(Number(e.target.value))}
          />
        </label>
        <button className="configs__play" aria-label="Play" type="button" onClick={playWordExample} />
      </div>
      <button type="button" onClick={saveSettings}>
        Save
      </button>
    </div>
  );
}
