import { useState } from 'react';
import { GlobalConstants } from '../../../GlobalConstants';
import { IGameAnswer } from '../../interfaces/IGameAnswer';
import { IGameQuestion } from '../../interfaces/IGameQuestion';
import { IGameQuestionArray } from '../../interfaces/IGameQuestionArray';
import { IResultData } from '../../interfaces/IResultData';
import { IUserWord } from '../../interfaces/IUserWord';
import { IWord } from '../../interfaces/IWord';
import { musicPlayer2 } from '../../services/SingleMusicPlayer2';
import { TokenProvider } from '../../services/TokenProvider';
import { UserWordService } from '../../services/UserWordService';
import { WordService } from '../../services/WordService';
import { executePromisesSequentially } from '../../utils/executePromisesSequentially';
import { MiniGameStart } from '../../components/common/min-game/MiniGameStart';
import { MiniGameStatistic } from '../../components/common/statistic/MiniGameStatistic';
import { AudiocallGameField } from '../../components/audiocall/AudiocallGameField';
import DataLocalStorageProvider from '../../services/DataLocalStorageProvider';

interface AudiocallPageState {
  questions: IGameQuestionArray | undefined;
  results: Array<IResultData> | undefined;
  answerChain: number;
  level: number;
  page: number;
}

export function AudiocallPage() {
  const initialState = {
    questions: undefined,
    results: undefined,
    answerChain: 0,
    level: -1,
    page: -1,
  } as AudiocallPageState;

  const [state, setState] = useState<AudiocallPageState>(initialState);

  const { questions, results, answerChain, level, page } = state;

  const currentTrack = musicPlayer2.getCurrentPlayingTrack();
  if (!currentTrack || currentTrack.indexOf(GlobalConstants.AUDIOCALL_MUSIC_NAME) < 0) {
    const userConfigs = DataLocalStorageProvider.getData();

    const musicVolumeMultiplier = userConfigs.userConfigs.musicLevel;
    const musicVolume = musicVolumeMultiplier * 0.1;

    musicPlayer2.setVolume(musicVolume);
    musicPlayer2.setPlayList([`${GlobalConstants.MUSIC_PATH + GlobalConstants.AUDIOCALL_MUSIC_NAME}`], true);
    musicPlayer2.play().catch(() => {});
  }

  const createVariantsForAnswer = (wordsArray: Array<IWord>, count: number, currentWord: IWord) => {
    const onlyDifferentWords = wordsArray.filter((word) => word.id !== currentWord.id);

    const shuffledAndCutArray = [...onlyDifferentWords].sort(() => Math.random() - 0.5).slice(0, count - 1);

    const incorrectVariants = shuffledAndCutArray.map((word) => {
      const newVariant = {
        wordData: word,
        isCorrect: false,
      };
      return newVariant as IGameAnswer;
    });

    const correctVariant = {
      wordData: currentWord,
      isCorrect: true,
    } as IGameAnswer;

    return incorrectVariants.concat(correctVariant).sort(() => Math.random() - 0.5);
  };

  const createQuestions = (wordsArray: Array<IWord>) => {
    const result = wordsArray.map((word) => {
      const newQuestion = {
        wordData: word,
        variants: createVariantsForAnswer(wordsArray, 4, word),
      };
      return newQuestion as IGameQuestion;
    });

    return result.sort(() => Math.random() - 0.5);
  };

  if (level > -1 && page > -1 && questions === undefined) {
    WordService.getWordsByGroupAndPage(level, page)
      .then((wordData) => {
        const questionsData = {
          questions: createQuestions(wordData.array),
          currentQuestion: 0,
        } as IGameQuestionArray;
        setState({ ...state, questions: questionsData });
      })
      .catch((e) => console.error(e));
  }

  const onGameFinish = (resultsOfGame: Array<IResultData>, answerChainOfGame: number) => {
    setState({ ...state, results: resultsOfGame, answerChain: answerChainOfGame });

    const isExpired = TokenProvider.checkIsExpired();
    const userId = TokenProvider.getUserId();

    if (isExpired || !userId) {
      return;
    }

    // eslint-disable-next-line arrow-body-style
    const promiseFunction = (item: IResultData) => {
      return () => UserWordService.setWordStatistic(userId, item.questionData.id, item.isCorrect);
    };

    const setWordStatisticPromises = resultsOfGame.map(promiseFunction);

    executePromisesSequentially<IUserWord>(setWordStatisticPromises)
      .then()
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const onGameStart = (levelChosen: number, pageChosen: number) => {
    setState({ ...state, level: levelChosen, page: pageChosen });
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

  const getContent = () => {
    if (results) {
      return <MiniGameStatistic title={title} resultData={results} answerChain={answerChain} />;
    }

    if (level > -1 && page > -1 && questions) {
      return <AudiocallGameField questions={questions.questions} onFinish={onGameFinish} />;
    }

    return <MiniGameStart title={title} description={description} buttonText={buttonText} onStart={onGameStart} />;
  };

  return <div className="mini-game-page">{getContent()}</div>;
}
