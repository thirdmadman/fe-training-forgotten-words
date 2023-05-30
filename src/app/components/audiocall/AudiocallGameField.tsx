import { useState } from 'react';
import { IGameAnswer } from '../../interfaces/IGameAnswer';
import { IGameQuestion } from '../../interfaces/IGameQuestion';
import { IResultData } from '../../interfaces/IResultData';
import { IWord } from '../../interfaces/IWord';
import './AudiocallGameField.scss';
import { AudiocallQuestion } from './AudiocallQuestion';

interface AudiocallGameFieldProps {
  questions: Array<IGameQuestion>;
  onFinish: (resultsOfGame: Array<IResultData>, answerChainOfGame: number) => void;
}

interface IAudiocallGameFieldState {
  questionNumber: number;
  answerChain: number;
  maxAnswerChain: number;
  result: Array<IResultData> | undefined;
}

export function AudiocallGameField(props: AudiocallGameFieldProps) {
  const { questions, onFinish } = props;
  const initialState = {
    questionNumber: 0,
    answerChain: 0,
    maxAnswerChain: 1,
    result: undefined,
  };

  const [state, setState] = useState<IAudiocallGameFieldState>(initialState);

  const { questionNumber, answerChain, maxAnswerChain, result } = state;

  const onAnswer = (question: IWord, answersArray: Array<IGameAnswer>, index: number) => {
    if (questions && questionNumber < questions.length) {
      const newState = { ...state };
      let isAnswerCorrect = false;
      if (answersArray[index] && answersArray[index].isCorrect) {
        isAnswerCorrect = true;
        if (answerChain + 1 > maxAnswerChain) {
          newState.maxAnswerChain = answerChain + 1;
        }
        newState.answerChain = answerChain + 1;
      } else {
        newState.answerChain = 1;
      }

      const currentResult = {
        questionData: question,
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

  return (
    <div className="gamefield-container">
      <h2 className="mini-game-page__title mini-game-page__title_in-game">Audio decoding</h2>
      {questionData && <AudiocallQuestion questionData={questionData} onAnswer={onAnswer} />}
    </div>
  );
}
