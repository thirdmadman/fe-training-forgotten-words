import { useState } from 'react';
import { GlobalConstants } from '../../../../GlobalConstants';
import { IGameAnswer } from '../../../interfaces/IGameAnswer';
import { IGameQuestion } from '../../../interfaces/IGameQuestion';
import { IGameQuestionArray } from '../../../interfaces/IGameQuestionArray';
import { IResultData } from '../../../interfaces/IResultData';
import { IWord } from '../../../interfaces/IWord';
import { musicPlayer2 } from '../../../services/SingleMusicPlayer2';
import { TokenProvider } from '../../../services/TokenProvider';
import { UserWordService } from '../../../services/UserWordService';
import { WordService } from '../../../services/WordService';
import { MiniGameStartPage } from '../../common/MiniGameStartPage';
import { StatisticPage } from '../../common/StatisticPage';
import { AudiocallGameField } from './AudiocallGameField';

export function AudiocallPage() {
  const [questions, setQuestions] = useState<IGameQuestionArray>();
  const [results, setResults] = useState<Array<IResultData>>();
  const [answerChain, setAnswerChain] = useState(0);
  const [level, setLevel] = useState(-1);
  const [page, setPage] = useState(-1);

  const currentTrack = musicPlayer2.getCurrentPlayingTrack();
  if (!currentTrack || currentTrack.indexOf(GlobalConstants.AUDIOCALL_MUSIC_NAME) < 0) {
    musicPlayer2.setVolume(0.1);
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
        setQuestions(questionsData);
      })
      .catch((e) => console.error(e));
  }

  const onGameFinish = (resultsOfGame: Array<IResultData>, answerChainOfGame: number) => {
    const userId = TokenProvider.getUserId();
    if (userId && !TokenProvider.checkIsExpired()) {
      resultsOfGame.forEach((item) => {
        UserWordService.setWordStatistic(userId, item.questionData.id, item.isCorrect).catch((e) => console.error(e));
      });
    }

    setResults(resultsOfGame);
    setAnswerChain(answerChainOfGame);
  };

  const onGameStart = (levelChosen: number, pageChose: number) => {
    setLevel(levelChosen);
    setPage(pageChose);
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
      return <StatisticPage title={title} resultData={results} answerChain={answerChain} />;
    }

    if (level > -1 && page > -1 && questions) {
      return <AudiocallGameField questions={questions.questions} onFinish={onGameFinish} />;
    }

    return <MiniGameStartPage title={title} description={description} buttonText={buttonText} onStart={onGameStart} />;
  };

  return <div className="mini-game-page">{getContent()}</div>;
}
