import { useEffect } from 'react';
import { GlobalConstants } from '../../../GlobalConstants';
import { IResultData } from '../../interfaces/IResultData';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { MiniGameStart } from '../../components/common/min-game/MiniGameStart';
import { MiniGameStatistic } from '../../components/common/statistic/MiniGameStatistic';
import { AudiocallGameField } from '../../components/audiocall/AudiocallGameField';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';
import {
  getQuestionsAction,
  setLevelAndPageAction,
  setResultsAction,
  switchToNextPageAction,
  switchToSelectionAction,
} from '../../redux/features/audiocall/audiocallSlice';
import { sendMiniGameStatisticsAction } from '../../redux/features/mini-game/sendMiniGameStatisticsThunk';
import { useAppDispatch, useAppSelector } from '../../hooks';

export function AudiocallPage() {
  const { questions, results, answerChain, level, page } = useAppSelector((state) => state.audiocall);

  const dispatch = useAppDispatch();

  const currentTrack = musicPlayer2.getCurrentPlayingTrack();
  if (!currentTrack || currentTrack.indexOf(GlobalConstants.AUDIOCALL_MUSIC_NAME) < 0) {
    const userConfigs = DataLocalStorageProvider.getData();

    const musicVolumeMultiplier = userConfigs.userConfigs.musicLevel;
    const musicVolume = musicVolumeMultiplier * 0.1;

    musicPlayer2.setVolume(musicVolume);
    musicPlayer2.setPlayList([`${GlobalConstants.MUSIC_PATH + GlobalConstants.AUDIOCALL_MUSIC_NAME}`], true);
    musicPlayer2.play().catch((e) => console.error(e));
  }

  const onGameFinish = (resultsOfGame: Array<IResultData>, answerChainOfGame: number) => {
    dispatch(setResultsAction({ results: resultsOfGame, answerChain: answerChainOfGame }));
    dispatch(sendMiniGameStatisticsAction({ results: resultsOfGame, answerChain: answerChainOfGame })).catch((e) => {
      console.error(e);
    });
  };

  const onGameStart = (levelChosen: number, pageChosen: number) => {
    dispatch(setLevelAndPageAction({ level: levelChosen, page: pageChosen }));
  };

  const title = 'Audio decoding';
  const description = (
    <>
      Record of vice will be played.
      <br />
      Make a match between what is said and what is written.
    </>
  );
  const buttonText = 'Start decoding';

  const handleOnBackToSelect = () => dispatch(switchToSelectionAction());
  const handleOnNext = () => dispatch(switchToNextPageAction());

  const getContent = () => {
    if (results) {
      return (
        <MiniGameStatistic
          title={title}
          resultData={results}
          answerChain={answerChain}
          handleOnBackToSelect={handleOnBackToSelect}
          handleOnNext={handleOnNext}
        />
      );
    }

    if (level > -1 && page > -1 && questions) {
      return <AudiocallGameField questions={questions.questions} onFinish={onGameFinish} />;
    }

    return <MiniGameStart title={title} description={description} buttonText={buttonText} onStart={onGameStart} />;
  };

  useEffect(() => {
    if (level > -1 && page > -1 && questions === undefined) {
      dispatch(getQuestionsAction({ page, level })).catch((e) => console.error(e));
    }
  });

  return <div className="mini-game-page">{getContent()}</div>;
}
