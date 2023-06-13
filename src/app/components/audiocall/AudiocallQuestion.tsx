import { useEffect } from 'react';
import { GlobalConstants } from '../../../GlobalConstants';
import { IGameAnswer } from '../../interfaces/IGameAnswer';
import { IGameQuestion } from '../../interfaces/IGameQuestion';
import { IWord } from '../../interfaces/IWord';
import { musicPlayer } from '../../services/SingleMusicPlayer';
import './AudiocallQuestion.scss';

interface AudiocallQuestionProps {
  questionData: IGameQuestion;
  onAnswer: (question: IWord, answersArray: Array<IGameAnswer>, index: number) => void;
}

export function AudiocallQuestion(props: AudiocallQuestionProps) {
  const { questionData, onAnswer } = props;

  const { wordData, variants } = questionData;

  const playAudio = () => {
    musicPlayer.setPlayList([`${GlobalConstants.DEFAULT_API_URL}/${wordData.audio}`]);
    musicPlayer.play().catch((e) => console.error(e));
  };

  const keyPressHandler = (event: KeyboardEvent) => {
    if (!variants) {
      return;
    }

    if (event.code === 'Digit1') {
      document.removeEventListener('keyup', keyPressHandler);
      onAnswer(wordData, variants, 0);
    } else if (event.code === 'Digit2') {
      document.removeEventListener('keyup', keyPressHandler);
      onAnswer(wordData, variants, 1);
    } else if (event.code === 'Digit3') {
      document.removeEventListener('keyup', keyPressHandler);
      onAnswer(wordData, variants, 2);
    } else if (event.code === 'Digit4') {
      document.removeEventListener('keyup', keyPressHandler);
      onAnswer(wordData, variants, 3);
    }
  };

  const getVariants = () => {
    if (!variants) {
      return '';
    }

    const getVariantElement = (answer: IGameAnswer, index: number) => {
      const { wordTranslate } = answer.wordData;
      return (
        <button type="button" className="button-answer" onClick={() => onAnswer(wordData, variants, index)} key={index}>
          <div className="button-answer__text">{wordTranslate}</div>
          <div className="button-answer__count">{index + 1}</div>
        </button>
      );
    };
    return variants.map(getVariantElement);
  };

  useEffect(() => {
    playAudio();
    document.addEventListener('keyup', keyPressHandler);
    return () => {
      document.removeEventListener('keyup', keyPressHandler);
    };
  });

  return (
    <div className="word-container">
      <button type="button" className="audio-btn" aria-label="paly audio" onClick={playAudio} />
      <div className="word-container__question-text">Choose correct one</div>
      <div className="game-btn-container">{getVariants()}</div>
    </div>
  );
}
