/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { GlobalConstants } from '../../../../GlobalConstants';
import { IGameAnswer } from '../../../interfaces/IGameAnswer';
import { IGameQuestion } from '../../../interfaces/IGameQuestion';
import { IResultData } from '../../../interfaces/IResultData';
import { IWord } from '../../../interfaces/IWord';
import { musicPlayer2 } from '../../../services/SingleMusicPlayer2';
import { WordService } from '../../../services/WordService';
import { StatisticPage } from '../../common/StatisticPage';
import { SprintGameField } from './SprintGameField';
import '../../common/MiniGameStartPage.scss';
import { MiniGameStartPage } from '../../common/MiniGameStartPage';

export function SprintPage() {
  // const startPage = new SprintStartPage(group - 1, page - 1);
  // const gameField = new SprintGameField();

  // const onStartGame = (selectedGroup: number, selectedPage: number) => {
  //   WordService.getWordsByGroupAndPage(selectedGroup, selectedPage)
  //     .then((wordData) => {
  //       const questionsData = {
  //         questions: this.createQuestions(wordData.array),
  //         currentQuestion: 0,
  //       } as IGameQuestionArray;

  //       this.rootNode.innerHTML = '';
  //       gameField.setQuestionsArray(questionsData);
  //       gameField.startGame();
  //       this.rootNode.append(gameField.getElement());
  //     })
  //     .catch((e) => console.error(e));
  // };

  // const onFinish = (result: IResultData[], answerChain: number) => {
  //   const resultPage = new SprintStatisticPage(result, answerChain);
  //   this.rootNode.append(resultPage.getElement());
  // };

  const [questions, setQuestions] = useState<Array<IGameQuestion>>();
  const [results, setResults] = useState<Array<IResultData>>();
  const [answerChain, setAnswerChain] = useState(0);
  const [level, setLevel] = useState(-1);
  const [page, setPage] = useState(-1);

  const currentTrack = musicPlayer2.getCurrentPlayingTrack();
  if (!currentTrack || currentTrack.indexOf(GlobalConstants.SPRINT_MUSIC_NAME) < 0) {
    musicPlayer2.setVolume(0.1);
    musicPlayer2.setPlayList([`${GlobalConstants.MUSIC_PATH + GlobalConstants.SPRINT_MUSIC_NAME}`], true);
    musicPlayer2.play().catch(() => {});
  }

  useEffect(() => {
    const createVariantForAnswer = (wordsArray: Array<IWord>, currentWord: IWord) => {
      const onlyDifferentWords = wordsArray.filter((word) => word.id !== currentWord.id);
      const shuffledAndCutArray = [...onlyDifferentWords].sort(() => Math.random() - 0.5).slice(0, 1);
      const variant = [currentWord, ...shuffledAndCutArray]
        .sort(() => Math.random() - 0.5)
        .slice(0, 1)
        .map((word) => {
          const isCorrect = word.id === currentWord.id;
          return {
            wordData: word,
            isCorrect,
          } as IGameAnswer;
        });
      return variant;
    };

    const createQuestions = (wordsArray: Array<IWord>) => {
      const result = wordsArray.map((word) => {
        const variants = createVariantForAnswer(wordsArray, word);
        return {
          wordData: word,
          variants,
        } as IGameQuestion;
      });

      return result.sort(() => Math.random() - 0.5);
    };

    WordService.getWordsByGroupAndPage(0, 0)
      .then((wordData) => {
        const questionsArray = createQuestions(wordData.array);
        setQuestions(questionsArray);
      })
      .catch((e) => console.error(e));
  }, []);

  const onGameFinish = (resultsOfGame: Array<IResultData>, answerChainOfGame: number) => {
    setResults(resultsOfGame);
    setAnswerChain(answerChainOfGame);
  };

  const onGameStart = (levelChosen: number, pageChose: number) => {
    setLevel(levelChosen);
    setPage(pageChose);
  };

  const title = 'MEANING RESOLVING';
  const description = (
    <>
      Your time is limited.
      <br /> Make decisions - is it correct match of word meaning.
    </>
  );
  const buttonText = 'START RESOLVING';

  const getContent = () => {
    if (results) {
      return <StatisticPage title="Meaning Resolving" resultData={results} answerChain={answerChain} />;
    }

    if (level > -1 && page > -1) {
      return <SprintGameField questions={questions} onFinish={onGameFinish} />;
    }

    return <MiniGameStartPage title={title} description={description} buttonText={buttonText} onStart={onGameStart} />;
  };

  return <div className="mini-game-page">{getContent()}</div>;
}
