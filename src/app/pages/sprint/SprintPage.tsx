import { useEffect } from 'react';
import { GlobalConstants } from '../../../GlobalConstants';
import { IResultData } from '../../interfaces/IResultData';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { MiniGameStatistic } from '../../components/common/statistic/MiniGameStatistic';
import { SprintGameField } from '../../components/sprint/SprintGameField';
import { MiniGameStart } from '../../components/common/min-game/MiniGameStart';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import { getQuestionsAction, setLevelAndPageAction, setResultsAction } from '../../redux/features/sprint/sprintSlice';
import { sendMiniGameStatisticsAction } from '../../redux/features/mini-game/sendMiniGameStatisticsThunk';
import { useAppDispatch, useAppSelector } from '../../hooks';

export function SprintPage() {
  const { questions, results, answerChain, level, page } = useAppSelector((state) => state.sprint);

  const dispatch = useAppDispatch();

  const onGameFinish = (resultsOfGame: Array<IResultData>, answerChainOfGame: number) => {
    dispatch(setResultsAction({ results: resultsOfGame, answerChain: answerChainOfGame }));
    dispatch(sendMiniGameStatisticsAction({ results: resultsOfGame, answerChain: answerChainOfGame })).catch(() => {});
  };

  const onGameStart = (levelChosen: number, pageChosen: number) => {
    dispatch(setLevelAndPageAction({ level: levelChosen, page: pageChosen }));
  };

  const title = 'MEANING RESOLVING';
  const description = (
    <>
      Your time is limited.
      <br />
      Make decisions - is it correct match of word meaning.
    </>
  );
  const buttonText = 'START RESOLVING';

  const getContent = () => {
    if (results) {
      return <MiniGameStatistic title="Meaning Resolving" resultData={results} answerChain={answerChain} />;
    }

    if (level > -1 && page > -1 && questions) {
      return <SprintGameField questions={questions} onFinish={onGameFinish} />;
    }

    return <MiniGameStart title={title} description={description} buttonText={buttonText} onStart={onGameStart} />;
  };

  useEffect(() => {
    const currentTrack = musicPlayer2.getCurrentPlayingTrack();
    if (!currentTrack || currentTrack.indexOf(GlobalConstants.SPRINT_MUSIC_NAME) < 0) {
      const userConfigs = DataLocalStorageProvider.getData();

      const musicVolumeMultiplier = userConfigs.userConfigs.musicLevel;
      const musicVolume = musicVolumeMultiplier * 0.2;

      musicPlayer2.setVolume(musicVolume);
      musicPlayer2.setPlayList([`${GlobalConstants.MUSIC_PATH + GlobalConstants.SPRINT_MUSIC_NAME}`], true);
      musicPlayer2.play().catch(() => {});
    }

    if (level > -1 && page > -1 && questions === undefined) {
      dispatch(getQuestionsAction({ page, level })).catch(() => {});
    }
  });

  return <div className="mini-game-page">{getContent()}</div>;
}
