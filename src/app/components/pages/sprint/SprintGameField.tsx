/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { IGameQuestion } from '../../../interfaces/IGameQuestion';
import { SprintQuestion } from './SprintQuestion';
import './SprintGameField.scss';
import { GlobalConstants } from '../../../../GlobalConstants';
import { IResultData } from '../../../interfaces/IResultData';
import { IGameAnswer } from '../../../interfaces/IGameAnswer';

interface SprintGameFieldProps {
  questions: Array<IGameQuestion> | undefined;
  onFinish: (resultsOfGame: Array<IResultData>, answerChainOfGame: number) => void;
}

export function SprintGameField(props: SprintGameFieldProps) {
  // onFinish = (result: IResultData[], answerChain: number) => {};

  // nextQuestion() {
  //   if (!this.questionsArray) {
  //     return;
  //   }

  //   if (this.questionsArray.questions.length > this.questionsArray.currentQuestion + 1) {
  //     this.questionsArray.currentQuestion += 1;
  //     this.renderCard(this.questionsArray.questions[this.questionsArray.currentQuestion]);
  //   } else {
  //     this.onFinish(this.result, this.maxAnswerChain);
  //     clearInterval(this.gameTimer);
  //   }
  // }

  // renderCard(question: IGameQuestion) {
  //   const cardQuestion = new SprintQuestion(question);
  //   cardQuestion.onAnswer = (questionData, isCorrect) => {
  //     this.result.push({ questionData, isCorrect });
  //     cardQuestion.destroy();
  //     this.nextQuestion();

  //     if (!isCorrect) {
  //       this.answerChain = 0;
  //       return;
  //     }

  //     this.answerChain += 1;
  //     if (this.answerChain > this.maxAnswerChain) {
  //       this.maxAnswerChain = this.answerChain;
  //     }
  //   };

  //   this.rootNode.append(cardQuestion.getElement());
  // }

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
    if (timerRemainTime > 0) {
      window.setTimeout(() => {
        const lastTimerTime = timerRemainTime;
        setTimerRemainTime(lastTimerTime - 1);
      }, 1000);
    } else {
      onGameEnd();
    }
  });

  const nextQuestion = () => {
    if (questions) {
      const currentQuestionNumber = questionNumber;
      if (currentQuestionNumber < questions.length - 1) {
        setQuestionNumber(currentQuestionNumber + 1);
      }
    }
  };

  const handleAnswer = (question: IGameQuestion, answer: boolean) => {
    if (questions && questionNumber < questions.length - 1) {
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

      nextQuestion();
    } else {
      onGameEnd();
    }
  };

  if (questions) {
    return (
      <div className="gamefield-container">
        <h2 className="sprint-page__title sprint-page__title_in-game">MEANING RESOLVING</h2>
        <h3 className="sprint-page__sub-title">In progress</h3>
        <div className="sprint-page__timer-text">{timerRemainTime}</div>
        <SprintQuestion questionData={questions[questionNumber]} onAnswer={handleAnswer} />
      </div>
    );
  }

  return <div>gg</div>;
}
