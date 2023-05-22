import { useEffect, useState } from 'react';
import { IGameQuestion } from '../../interfaces/IGameQuestion';
import { SprintQuestion } from './SprintQuestion';
import { GlobalConstants } from '../../../GlobalConstants';
import { IResultData } from '../../interfaces/IResultData';
import './SprintGameField.scss';

interface SprintGameFieldProps {
  questions: Array<IGameQuestion>;
  onFinish: (resultsOfGame: Array<IResultData>, answerChainOfGame: number) => void;
}

export function SprintGameField(props: SprintGameFieldProps) {
  const { questions, onFinish } = props;
  const [timerRemainTime, setTimerRemainTime] = useState(GlobalConstants.GAME_TIME);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answerChain, setAnswerChain] = useState(0);
  const [maxAnswerChain, setMaxAnswerChain] = useState(1);
  const [result, setResult] = useState<Array<IResultData>>();

  const onGameEnd = () => {
    if (result) {
      onFinish(result, maxAnswerChain);
    }
  };

  useEffect(() => {
    if (timerRemainTime > 0 && questionNumber < questions.length) {
      window.setTimeout(() => {
        const lastTimerTime = timerRemainTime;
        setTimerRemainTime(lastTimerTime - 1);
      }, 1000);
    } else {
      onGameEnd();
    }
  });

  const handleAnswer = (question: IGameQuestion, answer: boolean) => {
    if (questions && questionNumber < questions.length) {
      let isAnswerCorrect = false;
      const oldAnswerChain = answerChain;
      if (question.variants[0].isCorrect === answer) {
        isAnswerCorrect = true;
        const oldMaxAnswerChain = maxAnswerChain;
        if (oldAnswerChain + 1 > oldMaxAnswerChain) {
          setMaxAnswerChain(oldAnswerChain + 1);
        }
        setAnswerChain(oldAnswerChain + 1);
      } else {
        setAnswerChain(1);
      }

      const currentResult = {
        questionData: question.wordData,
        isCorrect: isAnswerCorrect,
      } as IResultData;

      const oldResult = result;
      if (oldResult) {
        setResult([...oldResult, currentResult]);
      } else {
        setResult([currentResult]);
      }

      const currentQuestionNumber = questionNumber;
      if (currentQuestionNumber < questions.length) {
        setQuestionNumber(currentQuestionNumber + 1);
      } else {
        onGameEnd();
      }
    }
  };

  const questionData = questions[questionNumber];

  return (
    <div className="gamefield-container">
      <h2 className="mini-game-page__title mini-game-page__title_in-game">MEANING RESOLVING</h2>
      <h3 className="mini-game-page__sub-title">In progress</h3>
      <div className="mini-game-page__timer-text">{timerRemainTime}</div>
      {questionData && <SprintQuestion questionData={questionData} onAnswer={handleAnswer} />}
    </div>
  );
}
