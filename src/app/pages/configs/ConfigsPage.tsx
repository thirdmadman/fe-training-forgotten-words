import { useEffect, useState } from 'react';
import { GlobalConstants } from '../../../GlobalConstants';
import { ISettings } from '../../interfaces/ISettings';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import { musicPlayer } from '../../services/SingleMusicPlayer';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { TokenProvider } from '../../services/TokenProvider';
import { UserSettingService } from '../../services/UserSettingService';
import { WordService } from '../../services/WordService';
import './configsPage.scss';

const { WORDBOOK_MUSIC_NAME, MUSIC_PATH, API_URL } = GlobalConstants;

const WORD_EXAMPLE_ID = '5e9f5ee35eb9e72bc21af5a8';

interface ConfigsPageState {
  soundsLevel: number;
  musicLevel: number;
}

export function ConfigsPage() {
  const initialState = {
    soundsLevel: 0,
    musicLevel: 0,
  };

  const [state, setState] = useState<ConfigsPageState>(initialState);

  const { soundsLevel, musicLevel } = state;

  const saveSettings = () => {
    const configs = { ...DataLocalStorageProvider.getData() };
    configs.userConfigs.soundsLevel = soundsLevel;
    configs.userConfigs.musicLevel = musicLevel;
    DataLocalStorageProvider.setData(configs);

    const isExpired = TokenProvider.checkIsExpired();
    const userId = TokenProvider.getUserId();

    if (isExpired || !userId) {
      return;
    }

    const userSetting = {
      wordsPerDay: 1,
      optional: configs.userConfigs,
    } as ISettings;

    UserSettingService.updateUserSettingById(userId, userSetting).catch((e) => console.error(e));
  };

  const soundsLevelHandler = (level: number) => {
    setState({ ...state, soundsLevel: Number(level) });
    musicPlayer.setVolume(0.7 * level);
  };
  const musicLevelHandler = (level: number) => {
    setState({ ...state, musicLevel: Number(level) });
    musicPlayer2.setVolume(0.09 * level);
  };

  const playWordExample = () => {
    musicPlayer.stop();
    WordService.getWordsById(WORD_EXAMPLE_ID)
      .then((word) => {
        soundsLevelHandler(soundsLevel);
        musicPlayer.setPlayList([`${API_URL}/${word.audio}`]);
        musicPlayer.play().catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  };

  const playMusicExample = () => {
    musicPlayer2.stop();
    musicLevelHandler(musicLevel);
    musicPlayer2.setPlayList([`${MUSIC_PATH + WORDBOOK_MUSIC_NAME}`]);
    musicPlayer2.play().catch((e) => console.error(e));
  };

  useEffect(() => {
    const { userConfigs } = DataLocalStorageProvider.getData();
    const soundsLevelConfig = userConfigs.soundsLevel;
    const musicLevelConfig = userConfigs.musicLevel;

    setState({ soundsLevel: soundsLevelConfig, musicLevel: musicLevelConfig });
  }, []);

  return (
    <div className="configs">
      <div className="configs__title">Configs</div>
      <div className="configs__group">
        <label htmlFor="config_music_level">
          <p>Music level [{musicLevel}]</p>
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
          <p>Sounds level [{soundsLevel}]</p>
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
      <button type="button" className="configs__save-button" onClick={saveSettings}>
        Save
      </button>
    </div>
  );
}
