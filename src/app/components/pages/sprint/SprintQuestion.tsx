import { IGameQuestion } from '../../../interfaces/IGameQuestion';
import './SprintQuestion.scss';

interface SprintQuestionProps {
  questionData: IGameQuestion;
  onAnswer: (question: IGameQuestion, answer: boolean) => void;
}

export function SprintQuestion(props: SprintQuestionProps) {
  const { questionData, onAnswer } = props;

  const { variants, wordData } = questionData;

  const handleAnswer = (answer: boolean) => {
    onAnswer(questionData, answer);
  };

  const handlerKey = (event: KeyboardEvent) => {
    if (event.code === 'Digit1') {
      document.removeEventListener('keyup', handlerKey);
      handleAnswer(true);
    } else if (event.code === 'Digit2') {
      document.removeEventListener('keyup', handlerKey);
      handleAnswer(false);
    }
  };

  document.addEventListener('keyup', handlerKey);

  const { word } = wordData;
  const translation = variants[0].wordData.wordTranslate;

  return (
    <div className="game-question">
      <div className="assumption">
        <div className="assumption__text">{word}</div>
        <div className="assumption__separator" />
        <div className="assumption__text">{translation}</div>
      </div>
      <h3 className="game-question__question-text">Is correct match?</h3>
      <div className="game-btn-container">
        <div className="question-container__btn">
          <button type="button" className="question-container__text" onClick={() => handleAnswer(true)}>
            true
          </button>
          <div className="question-container__count">1</div>
        </div>
        <div className="question-container__btn">
          <button type="button" className="question-container__text" onClick={() => handleAnswer(false)}>
            false
          </button>
          <div className="question-container__count">2</div>
        </div>
      </div>
    </div>
  );
}
