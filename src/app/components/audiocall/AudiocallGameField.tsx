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

export function AudiocallGameField(props: AudiocallGameFieldProps) {
  const { questions, onFinish } = props;
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answerChain, setAnswerChain] = useState(0);
  const [maxAnswerChain, setMaxAnswerChain] = useState(1);
  const [result, setResult] = useState<Array<IResultData>>();

  const onAnswer = (question: IWord, answersArray: Array<IGameAnswer>, index: number) => {
    if (questions && questionNumber < questions.length) {
      let isAnswerCorrect = false;
      const oldAnswerChain = answerChain;
      if (answersArray[index] && answersArray[index].isCorrect) {
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
        questionData: question,
        isCorrect: isAnswerCorrect,
      } as IResultData;

      const oldResult = result;

      const currentQuestionNumber = questionNumber;
      if (currentQuestionNumber < questions.length - 1) {
        if (oldResult) {
          setResult([...oldResult, currentResult]);
        } else {
          setResult([currentResult]);
        }
        setQuestionNumber(currentQuestionNumber + 1);
      } else if (oldResult) {
        onFinish([...oldResult, currentResult] as Array<IResultData>, maxAnswerChain);
      }
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
