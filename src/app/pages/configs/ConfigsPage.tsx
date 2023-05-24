import { useEffect, useState } from 'react';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import './configsPage.scss';

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
            onChange={(e) => setMusicLevel(Number(e.target.value))}
          />
        </label>
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
            onChange={(e) => setSoundsLevel(Number(e.target.value))}
          />
        </label>
        <button type="button" onClick={saveSettings}>
          Save
        </button>
      </div>
    </div>
  );
}
