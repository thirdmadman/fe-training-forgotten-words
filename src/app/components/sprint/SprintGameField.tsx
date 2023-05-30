import { useState } from 'react';
import { IGameQuestion } from '../../interfaces/IGameQuestion';
import { SprintQuestion } from './SprintQuestion';
import { GlobalConstants } from '../../../GlobalConstants';
import { IResultData } from '../../interfaces/IResultData';
import './SprintGameField.scss';
import { SprintTimer } from './SprintTimer';

interface SprintGameFieldProps {
  questions: Array<IGameQuestion>;
  onFinish: (resultsOfGame: Array<IResultData>, answerChainOfGame: number) => void;
}

interface SprintGameFieldState {
  questionNumber: number;
  answerChain: number;
  maxAnswerChain: number;
  result: Array<IResultData> | undefined;
}

export function SprintGameField(props: SprintGameFieldProps) {
  const { questions, onFinish } = props;

  const initialState = {
    questionNumber: 0,
    answerChain: 0,
    maxAnswerChain: 1,
    result: undefined,
  };

  const [state, setState] = useState<SprintGameFieldState>(initialState);

  const { questionNumber, answerChain, maxAnswerChain, result } = state;

  const onGameEnd = () => {
    if (result) {
      onFinish(result, maxAnswerChain);
    }
  };

  const handleAnswer = (question: IGameQuestion, answer: boolean) => {
    if (questions && questionNumber < questions.length) {
      const newState = { ...state };
      let isAnswerCorrect = false;
      if (question.variants[0].isCorrect === answer) {
        isAnswerCorrect = true;

        if (answerChain + 1 > maxAnswerChain) {
          newState.maxAnswerChain = answerChain + 1;
        }
        newState.answerChain = answerChain + 1;
      } else {
        newState.answerChain = 1;
      }

      const currentResult = {
        questionData: question.wordData,
        isCorrect: isAnswerCorrect,
      } as IResultData;

      if (result) {
        if (result.length + 1 < questions.length) {
          newState.result = [...result, currentResult];
        } else {
          onFinish([...result, currentResult] as Array<IResultData>, maxAnswerChain);
        }
      } else {
        newState.result = [currentResult];
      }

      newState.questionNumber = questionNumber + 1;
      setState(newState);
    }
  };

  const questionData = questions[questionNumber];

  // useEffect(() => {
  //   if (timerRemainTime > 0 && questionNumber < questions.length) {
  //     console.error('setTimeout');
  //     window.setTimeout(() => {
  //       console.error(state);
  //       setState({ ...state, timerRemainTime: timerRemainTime - 1 });
  //     }, 1000);
  //   } else {
  //     onGameEnd();
  //   }
  // });

  return (
    <div className="gamefield-container">
      <h2 className="mini-game-page__title mini-game-page__title_in-game">MEANING RESOLVING</h2>
      <h3 className="mini-game-page__sub-title">In progress</h3>
      <SprintTimer timerTime={GlobalConstants.GAME_TIME} timerOnFinishAction={onGameEnd} />
      {questionData && <SprintQuestion questionData={questionData} onAnswer={handleAnswer} />}
    </div>
  );
}
